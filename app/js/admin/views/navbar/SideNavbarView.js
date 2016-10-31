define(['jquery', 'underscore', 'marionette', 'helpers/events', 'helpers/utility', 'navbar/SideNavbarTemplate.html'], function($, _, Marionette, Events, Utility, Template) {
    return Marionette.ItemView.extend({
        el: "#SideNavbarView",
        template: _.template(Template),
        events: {
            "click #linkDashboard": function() {
                var linksource = "dashboard";
                this.updateNavigation(linksource);
                Events.trigger(Events.navigate, linksource);
            },
            "click #linkAvailableCampaigns": function() {
                var linksource = "availablecampaigns";
                this.updateNavigation(linksource);
                Events.trigger(Events.navigate, linksource);
            },
            "click #linkBloggers": function() {
                var linksource = "bloggers";
                this.updateNavigation(linksource);
                Events.trigger(Events.navigate, linksource);
            },
            "click #linkParticipations": function() {
                var linksource = "participations";
                this.updateNavigation(linksource);
                Events.trigger(Events.navigate, linksource);
            },
            "click #linkFilter": function() {
                var linksource = "filter";
                this.updateNavigation(linksource);
                Events.trigger(Events.navigate, linksource);
            },
            "click #linkTopics": function() {
                var linksource = "topics";
                this.updateNavigation(linksource);
                Events.trigger(Events.navigate, linksource);
            }
        },
        onBeforeRender: function() {
            this.listenTo(Events, Events.resize, this.onResize);
            this.listenTo(Events, Events.navigate, this.updateNavigation);
        },
        onRender: function() {
        	var options = {
				context: '#ContentLayout',
				dimPage: false,
				closable: false,
                debug: true,
                onShow: function() {
                    var data = {};
                    data.action = 'shown';
                    Events.trigger(Events.sidebarToggled, data);
                },
                onHidden: function() {
                    var data = {};
                    data.action = 'hidden';
                    Events.trigger(Events.sidebarToggled, data);
                }
			};
            if ($('#SideNavbarToggle').length > 0)
        	   this.$el.sidebar(options).sidebar('attach events', '#SideNavbarToggle');
            else {
                this.$el.sidebar(options);
                var that = this;
                this.listenToOnce(Events, Events.onRenderedSideNavToggle, function() {
                    that.$el.sidebar('attach events', '#SideNavbarToggle');
                });
            }
            this.__showActiveLink();
            this.onResize();
        },
        onResize: function(data) {
            if (!data)
                data = this.__getWindowDimensions();
            if (data.windowWidth < 768) {
                if (Utility.isSidebarVisible())
                    this.$el.sidebar('toggle');
                this.$el.addClass('labeled icon inline thin');
            } else if (data.windowWidth > 767) {
                if (!Utility.isSidebarVisible())
                    this.$el.sidebar('toggle');
                this.$el.removeClass('labeled icon inline thin');
            }
        },
        updateNavigation: function(linksource) {
            this.$el.find('.active').removeClass('active');
            switch(linksource){
                case "dashboard":
                    $('#linkDashboard').addClass("active");
                    break;
                case "availablecampaigns":
                    $('#linkAvailableCampaigns').addClass("active");
                    break;
                case "bloggers":
                    $('#linkBloggers').addClass("active");
                    break;
                case "participations":
                    $('#linkParticipations').addClass("active");
                    break;
                case "filter":
                    $('#linkFilter').addClass("active");
                    break;
                case "topics":
                    $('#linkTopics').addClass("active");
                    break;
            }
        },
        __showActiveLink: function() {
            var domId = this.__getProperListItemId();
            $(domId).addClass("active");
        },
        __getProperListItemId: function() {
            if (location.pathname.indexOf("/dashboard") > -1) {
                return "#linkDashboard";
            } else if (location.pathname.indexOf("/availablecampaigns") > -1) {
                return "#linkAvailableCampaigns";
            }
        },
        __getWindowDimensions: function() {
            var data = {};
            data.windowHeight = $(window).height();
            data.windowWidth = $(window).width();
            return data;
        }
    });
});