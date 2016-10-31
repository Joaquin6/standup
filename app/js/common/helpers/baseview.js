define(['jquery', 'underscore', 'marionette', 'services/cache', 'helpers/events', 'helpers/utility', 'helpers/baseconsts'], function($, _, Marionette, Cache, Events, Utility, Consts) {
    Marionette.LayoutView.prototype.parent = function(attribute, options) {
        // Call this inside of the child initialize method.  If it's a view, it will extend events also.
        // this.super('inherit', this.options);  <- A views params get set to this.options
        if (attribute == "inherit") {
            this.parent('initialize', options);
            // passes this.options to the base initialize method
            // extends child events with base events
            if (this.events) {
                $.extend(this.events, this.parent('events'));
                this.delegateEvents();
            }
            return;
        }
        // Call other base methods and attributes anywhere else.
        // this.parent('baseMethodOrOverriddenMethod', params) <- called anywhere or inside overridden method
        // this.parent'baseOrOverriddenAttribute') <- call anywhere
        if (_.isFunction(this.constructor.__super__[attribute]))
            return this.constructor.__super__[attribute].apply(this, _.rest(arguments));
        // maybe this is just a field - as such set it
        if (this.constructor.__super__[attribute] != undefined)
            this.constructor.__super__[attribute] = options;
    };
    Marionette.BaseView = Marionette.LayoutView.extend({
        __wsCallbacks : null,
        hideOnLoad : false,
        authorize : null,
        views : [],
        constructor: function(options) {
            this.__wsCallbacks = {};
            this.options = options || {};
            Marionette.LayoutView.apply(this, arguments);
        },
        initialize: function() {
            if (!this.__wsTestAuthorization())
                return;
            this.__wsReset();
            this.overrideConstructor();
            this.__wsCloneViews();
            this.__wsInjectTemplate();
            this.__wsInjectAttribute();
            this.__wsSetupHandlers();
            this.overrideInit();
            this.overrideRender();
            this.__wsLoadSubViews();
        },
        overrideConstructor : function() {
            //console.log('ctor - child may override this for constructor call');
        },
        overrideInit : function() {
            //console.log('init - child may override this for custom initialization');
        },
        overrideDispose : function() {
            //console.log('dispose - child may override this for cleanup');
        },
        overrideRender : function() {
            //console.log('render - override for any custom rendering');
        },
        overrideGetTemplate : function() {
            //console.log('ERROR: get Template - for ' + this.options.viewname + ' must be overwritten on child for HTML template injection!');
            return null;
        },
        overrideGetModel : function() {
            //console.log('get Model - child may override this to return any underlying model it may have');
            return null;
        },
        overrideOnResize : function() {
            //console.log('resize - child may override this to listen for changes in view size');
        },
        overrideOnViewCreated : function() {
            //console.log('resize - child may override this to listen for when this view has been created');
        },
        overrideOnEvent : function() {
            //console.log('view event - child may override this to listen to any events');
        },
        /**
         * [dispose description]
         * @param  {element} element  [optionally pass root element to start disposing views underneath and including this element]
         * @return {type} [description]
         */
        dispose : function(element) {
            // sometimes - this views is just a holder for others (that are inserted directly in DOM - so use 2nd way to dispose - by passing in root element)
            for (var i = 0; i < this.views.length; i++) {
                if (this.views[i].getContext != undefined) {
                    var view = this.views[i].getContext();
                    view.dispose();
                }
            }
            this.overrideDispose();
            this.stopListening();
            // if element not undefined - also dispose of any elements under us
            if (element) {
                // remove ourselves
                var view = Utility.getContext(element);
                if (view != null)
                    view.dispose();
            }
        },
        triggerEvent : function(eventtype, data, local) {
            if (data == undefined)
                data = {};
            data.evt = eventtype;
            // save it to cache - so user can get it back (in case they missed event)
            Cache.set(eventtype, data);
            if (local)
                this.__wsTriggerLocalEvent(data);
            else
                Events.trigger(Consts.evt.custom, data);
        },
        getId : function(elemid, startElem) {
            // deprecated! not mangled anymore - so just return id
            return elemid;
        },
        isVisible : function() {
            return $(this.el).is(":visible");
        },
        getWidth : function(full) {
            if (full)
                return $(this.el).outerWidth(true);
            return $(this.el).width();
        },
        getHeight : function(full) {
            if (full)
                return $(this.el).outerHeight(true);
            return $(this.el).height();
        },
        /**
         * [setEl typically a backbone view has an associated el - or element that is part of DOM - if for some reason you want to change the corresponding element - or set it call this method]
         */
        setEl : function(element) {
            this.el = element;
            this.__wsInjectAttribute();
        },
        /**
         * [resize call resize on myself - plus all my children]
         * @param  {bool} includingChildren - send resize event to children as well - if undefined - only this node
         * @param  {array} ignoreViews - list of views that should not be called
         */
        resize : function(includingChildren, ignoreViews) {
            if (includingChildren == undefined)
                includingChildren = true;
            if (this.isVisible()) {
                if (this.__wsIsOverridden('resize'))
                    this.__wsQueueResize();
            }
            if (includingChildren) {
                var elements = $(this.el).find('.data-wsview');
                $(elements).each(function() {
                    var view = Utility.getContext(this);
                    if (_.indexOf(ignoreViews, view) == -1) {
                        if (view != null)
                            view.resize(false);
                    }
                });
            }
        },
        getView : function() {
            return this;
        },
        getModel : function() {
            return this.overrideGetModel();
        },
        getParentContext : function() {
            return this.options.parentContext;
        },
        sink : function(action, callback) {
            var callbacks = this.__wsCallbacks[action];
            if (callbacks == undefined) {
                this.__wsCallbacks[action] = $.Callbacks();
                this.__wsCallbacks[action].add(callback);
            } else {
                if (!callbacks.has(callback))
                    callbacks.add(callback);
            }
            switch (action) {
            case Consts.evt.viewcreated:
                if (this.__wsIsViewCreated())
                    this.__wsFire(Consts.evt.viewcreated, this);
                break;
            default:
                this.unsink(action);
                break;
            }
        },
        unsink : function(callback) {
            for (var key in this.__wsCallbacks) {
                var callbacks = this.__wsCallbacks[key];
                if (callbacks.has(callback)) {
                    callbacks.remove(callback);
                }
            }
        },
        __wsQueueResize : function() {
            // since this is a widgets code (we can go through 'back door' - not really good - since webstack shouldn't know about widgets...but what the hey!)
            var renderManWidget = Utility.getSingleton('RenderManWidget');
            renderManWidget.queue(this.__wsOnQueuedResize, this);
        },
        __wsOnQueuedResize : function() {
            this.overrideOnResize();
        },
        __wsIsOverridden : function(method) {
            switch (method) {
            case "resize":
                if (this.overrideOnResize.toString().indexOf('resize - child may override') == -1)
                    return true;
                break;
            }
            return false;
        },
        __wsReset : function() {
            this.hideOnLoad = false;
            this.authorize = "";
        },
        __wsCloneViews : function() {
            // views array may have been updated (after constructor) so go ahead and deep clone it
            var cloneViews = [];
            for (var i = 0; i < this.views.length; i++) {
                var clone = jQuery.extend(true, {}, this.views[i]);
                cloneViews.push(clone);
            }
            this.views = cloneViews;
        },
        __wsFire : function(action, data) {
            var callbacks = this.__wsCallbacks[action];
            if (callbacks != undefined)
                callbacks.fire(data);
        },
        __wsTriggerLocalEvent : function(data) {
            // if this is a local event - then only views under us should get this event
            var nodes = $(this.el).find('.data-wsview');
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var view = $(node).data('data-wsview');
                view.__wsOnEvent(data);
            }
        },
        __wsSetupHandlers : function() {
            var that = this;
            this.listenTo(Events, Consts.evt.custom, this.__wsOnEvent);
        },
        __wsInjectTemplate : function() {
            if (this.options[Consts.options.el] != undefined) {
                this.el = $(this.options[Consts.options.el]);
            }
            var template = this.options[Consts.options.template];
            if (template == undefined) {
                template = this.overrideGetTemplate();
                if (template == undefined)
                    return;
            }
            // first see if (el) is part of DOM - else temp put it as part of body
            if ($(this.el).parent().length == 0)
                $('body').append($(this.el));
            var node = $(template);
            // has user set to hide on load?
            if (this.hideOnLoad)
                $(this.el).hide();
            $(this.el).html(node);
        },
        __wsOnChildViewCreated : function(context) {
            var that = this;
            for (var i = 0; i < this.views.length; i++) {
                if (this.views[i].id == context.id) {
                    // save context via IIEF - http://benalman.com/news/2010/11/immediately-invoked-function-expression/
                    (function(parentContext, context) {
                        that.views[i].getContext = function() {
                            return context;
                        };
                    })(that, context);
                }
            }
            if (this.__wsIsViewCreated())
                this.__wsTriggerViewCreated();
        },
        __wsIsViewCreated : function() {
            var viewsCreated = 0;
            var viewsAuthorizedCount = 0;
            for (var i = 0; i < this.views.length; i++) {
                if (this.__wsIsAuthorized(this.views[i].authorize)) {
                    viewsAuthorizedCount++;
                    if (this.views[i].getContext)
                        viewsCreated++;
                }
            }
            return viewsCreated == viewsAuthorizedCount;
        },
        __wsInjectAttribute : function() {
            // associate this view with this DOM element
            $(this.el).data('data-wsview', this);
            $(this.el).addClass('data-wsview');
        },
        __wsTriggerViewCreated : function() {
            var that = this;
            this.__wsFire(Consts.evt.viewcreated, this);
            that.overrideOnViewCreated();
            if (this.getParentContext())
                this.getParentContext().__wsOnChildViewCreated(this);
            if (this.options.onViewCreated)
                this.options.onViewCreated(this);
        },
        __wsLoadSubViews : function() {
            if (this.views == undefined || this.views.length == 0 || !this.__wsIsAuthorized(this.authorize)) {
                this.__wsTriggerViewCreated();
                return;
            }
            var list = [];
            var views = [];
            for (var i = 0; i < this.views.length; i++) {
                // just something so we can match up later
                if (this.__wsIsAuthorized(this.views[i].authorize)) {
                    this.views[i].id = Utility.getUniqueId();
                    list.push(this.views[i].definition);
                    views.push(this.views[i]);
                }
            }
            var that = this;
            list.forEach(function(definition, i, defArr) {
                // check if for some insane reason - client is trying to instatiate a singleton - in that case - we don't have a definition but an instance - i.e nothing to do
                if (definition instanceof Marionette.LayoutView) {
                    console.log('ERROR: you are trying to instantiate a class that is a singleton - this is invalid!');
                    return false;
                }
                var options = views[i].options;
                if (options == undefined)
                    options = {};
                if (views[i].el)
                    options.el = $(views[i].el);
                options.parentContext = that;
                options.id = views[i].id;
                // just instantiate it
                var context = new definition(options);
            });
        },
        __wsIsAuthorized : function(token) {
            return Utility.isAuthorized(token);
        },
        __wsTestAuthorization : function() {
            if (!this.__wsIsAuthorized(this.authorize)) {
                this.__wsTriggerViewCreated();
                return false;
            }
            return true;
        },
        __wsOnEvent : function(data) {
            this.overrideOnEvent(data);
        }
    });
});