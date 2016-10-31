define(['jquery', 'underscore', 'backbone', 'helpers/baseconsts', 'helpers/events'], function($, _, Backbone, Consts, Events) {
	Backbone.Model.prototype.parent = function(attribute, options) {
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

		return (_.isFunction(this.constructor.__super__[attribute])) ? this.constructor.__super__[attribute].apply(this, _.rest(arguments)) : this.constructor.__super__[attribute];
	};
	Backbone.BaseModel = (function(Model) {
		return Model.extend({
			__requests : {},
			__count : 0,
			__callbacks : null,
			/**
			 * [initialize description]
			 * @return {type} [description]
			 */
			initialize : function() {
				this.__count = 0;
				this.__callbacks = $.Callbacks("unique");
				this.__requests = {};
				this.overrideInit();
				this.listenTo(Events, Consts.evt.custom, this.__onCustom);
			},
			/**
			 * [overrideInit description]
			 * @return {type} [description]
			 */
			overrideInit : function() {
				//console.log('init - child may override this for custom initialization');
			},
			/**
			 * [overrideDispose description]
			 * @return {type} [description]
			 */
			overrideDispose : function() {
				//console.log('dispose - child may override this for cleanup');
			},
			/**
			 * [overrideRequest description]
			 * @param  {type} params [description]
			 * @return {type}        [description]
			 */
			overrideRequest : function(params) {
				//console.log('request - child may override this for any incoming requests that should be processed');
			},
			/**
			 * [overrideOnEvent description]
			 * @param  {type} data [description]
			 * @return {type}      [description]
			 */
			overrideOnEvent : function(data) {
				//console.log('event - child may override this to listen any events');
			},
			/**
			 * [request description]
			 * @param  {Function} callback [description]
			 * @param  {type}   params   [description]
			 * @return {type}            [description]
			 */
			request : function(callback, params) {
				this.addCallback(callback);
				this.overrideRequest(params);
			},
			/**
			 * [dispose description]
			 * @return {type} [description]
			 */
			dispose : function() {
				this.__callbacks.empty();
				this.stopListening(Events, Consts.evt.custom, this.__onCustom);
				this.overrideDispose();
			},
			/**
			 * [hasCallback description]
			 * @param  {Function} callback [description]
			 * @return {Boolean}           [description]
			 */
			hasCallback : function(callback) {
				if (callback == undefined)
					return this.__count;
				return this.__callbacks.has(callback);
			},
			/**
			 * [addCallback description]
			 * @param {Function} callback [description]
			 */
			addCallback : function(callback) {
				if (this.hasCallback(callback))
					return;
				this.__count++;
				this.__callbacks.add(callback);
			},
			/**
			 * [removeCallback description]
			 * @param  {Function} callback [description]
			 * @return {type}            [description]
			 */
			removeCallback : function(callback) {
				if (!this.hasCallback(callback))
					return;
				this.__count--;
				this.__callbacks.remove(callback);
			},
			/**
			 * [fireCallback description]
			 * @param  {type} p1  [description]
			 * @param  {type} p2  [description]
			 * @param  {type} p3  [description]
			 * @param  {type} p4  [description]
			 * @param  {type} p5  [description]
			 * @param  {type} p6  [description]
			 * @param  {type} p7  [description]
			 * @param  {type} p8  [description]
			 * @param  {type} p9  [description]
			 * @param  {type} p10 [description]
			 * @return {type}     [description]
			 */
			fireCallback : function(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10) {
				this.__callbacks.fire(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);
			},
			/**
			 * [triggerEvent useful for triggering events application wide]
			 * @param  {eventtype} eventtype [name of the event]
			 * @param  {data} data [data associated with the event]
			 */
			triggerEvent : function(eventtype, data) {
				Events.triggerEvent(eventtype, data);
			},
			/**
			 * [setRequest set this request handle - can later be used for querying if this request has been processed]
			 * @param  {handle} handle [handle id of this particular request]
			 */
			setRequest : function(handle) {
				if (this.__requests[handle])
					return;
				var request = {};
				request.handle = handle;
				this.__requests[handle] = request;
			},
			/**
			 * [setRequest set this request handle - can later be used for querying if this request has been processed]
			 * @param  {handle} handle [handle id of this particular request]
			 * @return {Boolean}     [return true if this request has not been processed - false if has been processed previously]
			 */
			setResponse : function(handle) {
				var request = this.__requests[handle];
				// this is weird...
				if (request == undefined) {
					request = {};
					request.handle = handle;
					request.hasResponse = true;
					this.__requests[handle] = request;
					return true;
				}
				if (request.hasResponse) {
					return false;
				}
				request.hasResponse = true;
				return true;
			},
			/**
			 * [hasRequest query if we have a response associated with this handle]
			 * @param  {handle} handle [handle id of this particular request/response]
			 * @return {Boolean}     [return true if this response exists - false if not]
			 */
			hasRequest : function(handle) {
				var request = this.__requests[handle];
				if (request == undefined)
					return false;
				return true;
			},
			__onCustom : function(data) {
				this.overrideOnEvent(data);
			}
		});
	})(Backbone.Model);
});