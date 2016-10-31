define(['jquery', 'underscore', 'marionette', 'main', 'helpers/events', 'helpers/utility', 'layouts/BaseLayoutTemplate.html', 'views/navbar/NavbarView', 'views/layouts/ContentLayout'], function($, _, Marionette, Main, Events, Utility, Template, NavbarView, ContentLayout) {
	return Marionette.LayoutView.extend({
		el: "body",
		template: _.template(Template),
		initialize: function() {
			this.listenTo(this.model, "change:notifyUser", this.onNotify);
			this.listenTo(this.model, "change:countDownDisplay", this.onCountdownDisplayChange);
		},
		onRender: function() {
			this.__initializeNavbar();

			this.__renderContentLayout(); // Deep Nested

			this.__handleInteraction();
		},
		resize: function(data) {
			var content = $('#ContentLayout');
			if (data.navbarHeight) {
				$(content).css({
					top: data.navbarHeight + 'px'
				});
			}
			if (data.windowHeight) {
				var contentHeight = data.windowHeight - data.navbarHeight;
				$(content).css({
					height: contentHeight + 'px'
				});
			}
		},
		onNotify: function(model, notifyUser) {
			if (notifyUser === undefined || notifyUser === false)
				return;
			var that = this;
			var options = {
				closable: false,
				onShow: function() {
					that.model.startCoundown();
				},
				onHidden: function() {
					var btnClicked = $(this).find('[data-clicked]');
					if ($(btnClicked).hasClass('deny')) {
						$(btnClicked).removeAttr('data-clicked');
						that.model.User.logout();
					} else {
						$(btnClicked).removeAttr('data-clicked');
						that.model.refreshSession();
					}
				},
				onDeny: function(el) {
					$(el).attr('data-clicked', true);
					return true;
				},
				onApprove: function(el) {
					$(el).attr('data-clicked', true);
					return true;
				}
			};

			if (!Utility.isProductionEnv())
				options.debug = true;

			$('#ModalContainer').modal(options).modal('show');
		},
		onCountdownDisplayChange: function(model, countDownDisplay) {
			$('#sm-countdown').html(countDownDisplay);
		},
        __initializeNavbar: function() {
        	var User = this.model.User;
        	if (!User.isInitialized()) {
        		var that = this;
        		this.listenToOnce(User, "change:isInitialized", function(isInitialized) {
        			that.__renderNavbar(User);
        		});
        	} else
        		this.__renderNavbar(User);
        },
        __renderNavbar: function(model) {
        	var view = new NavbarView({
                model: model
            });
        	view.render();
        },
        __renderContentLayout: function() {
        	var view = new ContentLayout();
        	view.render();
        },
        __handleInteraction: function() {
        	var $win = $(window), that = this;
        	$win.on("debouncedresize", function(event) {
				Events.trigger(Events.resize, that.__getResizeData());
			});
			this.resize(this.__getResizeData());
        },
        __getResizeData: function() {
        	var data = {};
        	data.windowHeight = $(window).height();
        	data.windowWidth = $(window).width();
			data.navbarHeight = $('#NavbarView').height();
			data.contentWidth = $('#ContentLayout').width();
			data.sidebarWidth = $('.vertical.sidebar.menu').width();
			return data;
        }
	});
});