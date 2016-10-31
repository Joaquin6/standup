define(['jquery', 'underscore', 'marionette', 'main', 'helpers/events', 'layouts/ContentLayoutTemplate.html', 'views/navbar/SideNavbarView', 'views/layouts/ContentBodyLayout'], function($, _, Marionette, Main, Events, Template, SideNavbarView, ContentBodyLayout) {
	return Marionette.LayoutView.extend({
		__views: {},
		el: "#ContentLayout",
		template: _.template(Template),
		regions: {
			ContentBodyRegion: '#ContentBodyRegion'
		},
		initialize: function() {
			this.listenTo(Events, Events.hideLoader, this.onHideLoader);
			this.listenTo(Events, Events.showScroller, this.showNanoScroller);
			this.listenTo(Events, Events.resize, this.onResize);
		},
		onRender: function() {
			this.__renderSideNavbar();

			this.__renderContentBodyLayout();
		},
		onResize: function(data) {
            this.resizeHeight(data);
        },
		onHideLoader: function(childView) {
			setTimeout(function() {
				$('#fsLoader').removeClass('active').addClass('disabled');
			}, 1000);
		},
		showNanoScroller: function() {
			if (this.ContentBodyRegion.$el.hasClass('has-scrollbar')) {
				this.ContentBodyRegion.$el.nanoScroller({
					flash: true
				});
				return;
			}
			var maxHeight = this.ContentBodyRegion.$el.height();
			this.ContentBodyRegion.$el.nanoScroller({
				sliderMaxHeight: maxHeight,
				flash: true,
				tabIndex: -1
			});
        },
        resizeHeight: function(data) {
        	var adjustedHeight = data.windowHeight - data.navbarHeight;
            this.$el.css({
                height: adjustedHeight + 'px'
            });
        },
		__renderSideNavbar: function() {
			var view = new SideNavbarView({
				model: Main.App.Session.User
			});
			view.render();
        },
        __renderContentBodyLayout: function() {
        	this.__bindRegionOnShow();
        	if (!this.ContentBodyRegion.hasView()) {
            	this.ContentBodyRegion.show(this.__getContentBodyLayout());
        	} else {
            	this.ContentBodyRegion.show(this.__getContentBodyLayout(), {preventDestroy: true});
        	}
        },
        __getContentBodyLayout: function() {
        	var view;
            if (this.__views.contentBodyLayout) {
                view = this.__views.contentBodyLayout;
            } else {
                view = this.__views.contentBodyLayout = new ContentBodyLayout();
            }
            return view;
        },
        __bindRegionOnShow: function() {
        	var that = this;
        	this.ContentBodyRegion.on("show", function(view, region, options) {
        		that.showNanoScroller();
        	});
        }
	});
});