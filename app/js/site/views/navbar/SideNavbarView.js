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
            "click #linkMyCampaigns": function() {
                var linksource = "mycampaigns";
                this.updateNavigation(linksource);
                Events.trigger(Events.navigate, linksource);
            },
            "click #linkMyProfileSideNav": function() {
                var linksource = "myprofile";
                this.updateNavigation(linksource);
                Events.trigger(Events.navigate, linksource);
            },
            "click #linkContact": function() {
                var linksource = "contact";
                this.updateNavigation(linksource);
                Events.trigger(Events.navigate, linksource);
            },
            "click #linkTopics": function() {
                var linksource = "topics";
                this.updateNavigation(linksource);
                Events.trigger(Events.navigate, linksource);
            },
            "click #linkMyNetworks": function() {
                var linksource = "mynetworks";
                this.updateNavigation(linksource);
                Events.trigger(Events.navigate, linksource);
            },
            "click #linkPaymentInfo": function() {
                var linksource = "paymentinfo";
                this.updateNavigation(linksource);
                Events.trigger(Events.navigate, linksource);
            },
            "click #linkUserLogoutSideNav": function() {
                this.model.logout();
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
                case "mycampaigns":
                    $('#linkMyCampaigns').addClass("active");
                    break;
                case "myprofile":
                    $('#linkMyProfileSideNav').addClass("active");
                    break;
                case "contact":
                    $('#linkContact').addClass("active");
                    break;
                case "topics":
                    $('#linkTopics').addClass("active");
                    break;
                case "mynetworks":
                    $('#linkMyNetworks').addClass("active");
                    break;
                case "paymentinfo":
                    $('#linkPaymentInfo').addClass("active");
                    break;
            }
        },
        __showActiveLink: function() {
            var domId = this.__getProperListItemId();
            $(domId).addClass("active");
        },
        __getProperListItemId: function() {
            if (location.pathname.indexOf("/dashboard") > -1)
                return "#linkDashboard";
            else if (location.pathname.indexOf("/availablecampaigns") > -1)
                return "#linkAvailableCampaigns";
            else if (location.pathname.indexOf("/myprofile") > -1)
                return "#linkMyProfileSideNav";
            else if (location.pathname.indexOf("/mycampaigns") > -1)
                return "#linkMyCampaigns";
            else if (location.pathname.indexOf("/contact") > -1)
                return "#linkContact";
            else if (location.pathname.indexOf("/topics") > -1)
                return "#linkTopics";
            else if (location.pathname.indexOf("/mynetworks") > -1)
                return "#linkMyNetworks";
            else if (location.pathname.indexOf("/paymentinfo") > -1)
                return "#linkPaymentInfo";
        },
        __getWindowDimensions: function() {
            var data = {};
            data.windowHeight = $(window).height();
            data.windowWidth = $(window).width();
            return data;
        }
    });
});