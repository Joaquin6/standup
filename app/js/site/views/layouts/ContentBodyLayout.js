define(['jquery', 'underscore', 'marionette', 'main', 'helpers/events', 'helpers/utility', 'layouts/ContentBodyLayoutTemplate.html', 'views/components/TitleView', 'views/ApplicationStatusView', 'views/PaymentStatusView', 'views/myprofile/MyProfileView', 'views/layouts/AvailableCampaignsLayoutView', 'views/layouts/UpcomingCampaignsLayoutView', 'views/ContactView', 'views/TopicsView', 'views/MyNetworksView', 'views/CampaignDetailsView', 'collections/CampaignCollection', 'views/layouts/MyCampaignsLayoutView', 'views/layouts/PaymentInfoLayoutView', 'views/layouts/MiddleContentLayoutView', 'views/layouts/ParticipationsLayoutView'], function($, _, Marionette, Main, Events, Utility, Template, TitleView, ApplicationStatusView, PaymentStatusView, MyProfileView, AvailableCampaignsLayoutView, UpcomingCampaignsLayoutView, ContactView, TopicsView, MyNetworksView, CampaignDetailsView, CampaignCollection, MyCampaignsLayoutView, PaymentInfoLayoutView, MiddleContentLayoutView, ParticipationsLayoutView) {
    return Marionette.LayoutView.extend({
        __views: {},
        __auth: true,
        id: "ContentBodyLayout",
        className: "ui basic segment nano-content",
        template: _.template(Template),
        childEvents: {
			'nav:changed': 'onNavChanged'
		},
        regions: {
            UpperContentBodyRegion: '#UpperContentBodyRegion',
            MiddleContentBodyRegion: '#MiddleContentBodyRegion',
            LowerContentBodyRegion: '#LowerContentBodyRegion'
        },
        onBeforeShow: function() {
			this.listenTo(Events, Events.navigate, this.onNavChangedEvt);
            this.listenTo(Events, Events.showCampaignDetails, this.onShowCampaignDetails);
            this.listenTo(Events, Events.sidebarToggled, this.onSidebarToggle);
            this.listenTo(Events, Events.resize, this.onResize);
            this.listenTo(Events, Events.unauthorized, this.onUnauthorized);
		},
        onShow: function() {
            this.UpperContentBodyRegion.show(this.__getTitleView(true));
        	this.__handleMiddleContent(true);
            this.__handleLowerContent(true);
            var data = {};
            data.action = 'shown';
            this.onSidebarToggle(data);
		},
		onNavChangedEvt: function(linksource) {
			this.__handleBodyViewSwap(linksource);
		},
		onNavChanged: function(childView, linksource) {
			this.__handleBodyViewSwap(linksource);
		},
        onShowCampaignDetails: function(campaign) {
            var linksource = 'campaigndetails';
            this.__handleBodyViewSwap(linksource, campaign);
        },
        onSidebarToggle: function(data) {
            this.__handleEventResizeData(data);
            this.resizeWidth(data);
        },
        onResize: function(data) {
            this.__handleEventResizeData(data);
            this.resizeWidth(data);
        },
        resizeWidth: function(data) {
            var contentBodyWidth;
            if (data.action === 'hidden')
                contentBodyWidth = data.contentWidth;
            else
                contentBodyWidth = data.contentWidth - data.sidebarWidth;
            this.$el.css({
                width: contentBodyWidth + 'px',
                padding: '1em 1.25em 1em 1em'
            });
            Events.trigger(Events.showScroller);
        },
        onUnauthorized: function() {
            this.__auth = false;
        },
        __handleEventResizeData: function(data) {
            if (!data)
                data = {};
            if (!data.action) {
                data.action = 'shown';
                if (!Utility.isSidebarVisible())
                    data.action = 'hidden';
            }
            if (!data.contentWidth)
                data.contentWidth = this.$el.closest('.pushable').width();
            if (!data.sidebarWidth)
                data.sidebarWidth = $('.vertical.sidebar.menu').width();
        },
		__getProperPathView: function() {
            var that = this, view;
			if (location.pathname.indexOf("/dashboard") > -1)
                view = this.__getParticipationCollectionView();
            else if (location.pathname.indexOf("/availablecampaigns") > -1)
                view = this.__getAvailableCampaignsLayoutView();
            else if (location.pathname.indexOf("/myprofile") > -1)
                view = this.__getMyProfileView();
            else if (location.pathname.indexOf("/contact") > -1)
                view = this.__getContactView();
            else if (location.pathname.indexOf("/topics") > -1)
                view = this.__getTopicsView();
            else if (location.pathname.indexOf("/mynetworks") > -1)
                view = this.__getMyNetworksView();
            else if (location.pathname.indexOf("/paymentinfo") > -1)
                view = this.__getPaymentInfoLayoutView();
            return view;
		},
		__handleMiddleContent: function(reset) {
            var pathname = location.pathname;
            if (pathname.indexOf("/dashboard") > -1 || pathname.indexOf("/paymentinfo") > -1) {
                var UserModel = Main.App.Session.User;
                if (!UserModel.get('isInitialized')) {
                    var that = this;
                    this.listenToOnce(UserModel, "change:isInitialized", function(linksource) {
                        that.__showMidContent(reset, linksource);
                    });
                } else
                    this.__showMidContent(reset);
            } else if (pathname.indexOf("/availablecampaigns") > -1)
                this.__showMidContent(reset);
            else
                this.__hideMidContent();
		},
        __handleLowerContent: function(reset) {
            this.__bindRegionOnShow();
            var opts = {
                preventDestroy: true
            };
            if (location.pathname.indexOf("/myprofile") > -1) {
                var UserModel = Main.App.Session.User;
                if (!UserModel.get('isInitialized')) {
                    var that = this;
                    this.listenToOnce(UserModel, "change:isInitialized", function() {
                        that.LowerContentBodyRegion.show(that.__getMyProfileView(reset), opts);
                    });
                } else
                    this.LowerContentBodyRegion.show(this.__getMyProfileView(reset), opts);
            } else if (location.pathname.indexOf("/contact") > -1) {
                var UserModel = Main.App.Session.User;
                if (!UserModel.get('isInitialized')) {
                    var that = this;
                    this.listenToOnce(UserModel, "change:isInitialized", function() {
                        that.LowerContentBodyRegion.show(that.__getContactView(reset), opts);
                    });
                } else
                    this.LowerContentBodyRegion.show(this.__getContactView(reset), opts);
            } else if (location.pathname.indexOf("/paymentinfo") > -1) {
                var UserModel = Main.App.Session.User;
                if (!UserModel.get('isInitialized')) {
                    var that = this;
                    this.listenToOnce(UserModel, "change:isInitialized", function() {
                        that.LowerContentBodyRegion.show(this.__getPaymentInfoLayoutView(reset), opts);
                    });
                } else
                    this.LowerContentBodyRegion.show(this.__getPaymentInfoLayoutView(reset), opts);
            } else if (location.pathname.indexOf("/dashboard") > -1)
                this.LowerContentBodyRegion.show(this.__getParticipationsLayoutView(reset), opts);
            else if (location.pathname.indexOf("/availablecampaigns") > -1)
                this.LowerContentBodyRegion.show(this.__getUpcomingCampaignsLayoutView(reset), opts);
            else if (location.pathname.indexOf("/mycampaigns") > -1)
                this.LowerContentBodyRegion.show(this.__getMyCampaignsLayoutView(reset), opts);
            else if (location.pathname.indexOf("/topics") > -1)
                this.LowerContentBodyRegion.show(this.__getTopicsView(reset), opts);
            else if (location.pathname.indexOf("/mynetworks") > -1)
                this.LowerContentBodyRegion.show(this.__getMyNetworksView(reset), opts);
        },
		__showMidContent: function(reset, linksource) {
            var pathname = location.pathname, view;
            if (linksource && typeof linksource === 'string')
                pathname = '/' + linksource;

            if (pathname.indexOf("/dashboard") > -1)
                view = this.__getMiddleContentLayoutView(reset);
            else if (pathname.indexOf("/availablecampaigns") > -1)
                view = this.__getAvailableCampaignsLayoutView(reset);
            else if (pathname.indexOf("/paymentinfo") > -1)
                view = this.__getPaymentStatusView(reset);

            if (reset || !this.MiddleContentBodyRegion.hasView())
                this.MiddleContentBodyRegion.show(view);
            else
                this.MiddleContentBodyRegion.show(view, {preventDestroy: true});
		},
        __hideMidContent: function() {
            if (this.MiddleContentBodyRegion.hasView())
                this.MiddleContentBodyRegion.empty({preventDestroy: true});
        },
        __getTitleView: function(reset) {
            var view;
            if (!reset && this.__views.titleView)
                view = this.__views.titleView;
            else
                view = this.__views.titleView = new TitleView();
            return view;
        },
        __getParticipationsLayoutView: function(reset) {
            var view;
            if (!reset && this.__views.participationsLayoutView)
                view = this.__views.participationsLayoutView;
            else {
                view = this.__views.participationsLayoutView = new ParticipationsLayoutView();
            }
            return view;
        },
        __getAvailableCampaignsLayoutView: function(reset) {
            var view;
            if (this.__views.availableCampaignsLayoutView)
                view = this.__views.availableCampaignsLayoutView;
            else {
                view = this.__views.availableCampaignsLayoutView = new AvailableCampaignsLayoutView();
            }
            return view;
        },
        __getUpcomingCampaignsLayoutView: function(reset) {
            var view;
            if (!reset && this.__views.upcomingCampaignsLayoutView)
                view = this.__views.upcomingCampaignsLayoutView;
            else {
                view = this.__views.upcomingCampaignsLayoutView = new UpcomingCampaignsLayoutView();
            }
            return view;
        },
        __getMyProfileView: function(reset) {
            var view;
            if (!reset && this.__views.myProfileView)
                view = this.__views.myProfileView;
            if (reset || !this.__views.myProfileView || (view && view.isDestroyed)) {
                view = this.__views.myProfileView = new MyProfileView({
                    model: Main.App.Session.User
                });
            }
            return view;
        },
        __getCampaignDetailsView: function(reset, campaign) {
            if (campaign)
                campaign = CampaignCollection.get(campaign.id);
            var view = new CampaignDetailsView({
                model: campaign
            });
            return view;
        },
        __getContactView: function(reset) {
            var view;
            if (!reset && this.__views.contactView)
                view = this.__views.contactView;
            if (reset || !this.__views.contactView || (view && view.isDestroyed)) {
                view = this.__views.contactView = new ContactView({
                    model: Main.App.Session.User
                });
            }
            return view;
        },
        __getTopicsView: function() {
            var view;
            if (this.__views.topicsView)
                view = this.__views.topicsView;
            else {
                view = this.__views.topicsView = new TopicsView({
                    model: Main.App.Session.User
                });
            }
            return view;
        },
        __getMyNetworksView: function(reset) {
            var view;
            if (!reset && this.__views.myNetworksView)
                view = this.__views.myNetworksView;
            if (reset || !this.__views.myNetworksView || (view && view.isDestroyed))
                view = this.__views.myNetworksView = new MyNetworksView();
            return view;
        },
        __getMiddleContentLayoutView: function(reset) {
            var view;
            if (!reset && this.__views.middleContentLayoutView)
                view = this.__views.middleContentLayoutView;
            else
                view = this.__views.middleContentLayoutView = new MiddleContentLayoutView();
            return view;
        },
        __getApplicationStatusView: function() {
            var view;
            if (this.__views.applicationStatusView)
                view = this.__views.applicationStatusView;
            else {
                view = this.__views.applicationStatusView = new ApplicationStatusView({
                    model: Main.App.Session.User
                });
            }
            return view;
        },
        __getPaymentStatusView: function(reset) {
            var view;
            if (!reset && this.__views.paymentStatusView)
                view = this.__views.paymentStatusView;
            if (reset || !this.__views.paymentStatusView || (view && view.isDestroyed)) {
                view = this.__views.paymentStatusView = new PaymentStatusView({
                    model: Main.App.Session.User
                });
            }
            return view;
        },
        __getMyCampaignsLayoutView: function(reset) {
            var view;
            if (!reset && this.__views.myCampaignsLayoutView)
                view = this.__views.myCampaignsLayoutView;
            if (reset || !this.__views.myCampaignsLayoutView || (view && view.isDestroyed))
                view = this.__views.myCampaignsLayoutView = new MyCampaignsLayoutView();
            return view;
        },
        __getPaymentInfoLayoutView: function(reset) {
            var view;
            if (!reset && this.__views.paymentInfoLayoutView)
                view = this.__views.paymentInfoLayoutView;
            if (reset || !this.__views.paymentInfoLayoutView || (view && view.isDestroyed)) {
                view = this.__views.paymentInfoLayoutView = new PaymentInfoLayoutView({
                    model: Main.App.Session.User
                });
            }
            return view;
        },
        __handleBodyViewSwap: function(linksource, params) {
            this.__bindRegionOnShow();
            var views = this.__views;
            var opts = {
                preventDestroy: true
            };
            var initShow = false;
            if (this.__auth === false)
                return;
            switch (linksource) {
                case "dashboard":
                    this.__showMidContent(undefined, linksource);
                    if (!this.LowerContentBodyRegion.hasView())
                        initShow = true;
                    else if (this.LowerContentBodyRegion.hasView() && this.LowerContentBodyRegion.currentView.id !== "ParticipationsLayoutView")
                        initShow = true;
                    if (initShow)
                        this.LowerContentBodyRegion.show(this.__getParticipationsLayoutView(), opts);
                    break;
                case "availablecampaigns":
                    this.__showMidContent(undefined, linksource);
                    if (this.LowerContentBodyRegion.currentView.id !== "UpcomingCampaignsLayoutView")
                        this.LowerContentBodyRegion.show(this.__getUpcomingCampaignsLayoutView(), opts);
                    break;
                case "myprofile":
                    this.__hideMidContent(linksource);
                    if (this.LowerContentBodyRegion.currentView.id !== "MyProfileView")
                        this.LowerContentBodyRegion.show(this.__getMyProfileView(), opts);
                    break;
                case "mycampaigns":
                    this.__hideMidContent(linksource);
                    if (this.LowerContentBodyRegion.currentView.id !== "MyCampaignsLayoutView")
                        this.LowerContentBodyRegion.show(this.__getMyCampaignsLayoutView(), opts);
                    break;
                case "campaigndetails":
                    this.__hideMidContent(linksource);
                    if (this.LowerContentBodyRegion.currentView.id !== "CampaignDetailsView")
                        this.LowerContentBodyRegion.show(this.__getCampaignDetailsView(undefined, params), opts);
                    break;
                case "contact":
                    this.__hideMidContent(linksource);
                    if (this.LowerContentBodyRegion.currentView.id !== "ContactView")
                        this.LowerContentBodyRegion.show(this.__getContactView(), opts);
                    break;
                case "topics":
                    this.__hideMidContent(linksource);
                    if (this.LowerContentBodyRegion.currentView.id !== "TopicsView")
                        this.LowerContentBodyRegion.show(this.__getTopicsView(), opts);
                    break;
                case "mynetworks":
                    this.__hideMidContent(linksource);
                    if (this.LowerContentBodyRegion.currentView.id !== "MyNetworksView")
                        this.LowerContentBodyRegion.show(this.__getMyNetworksView(), opts);
                    break;
                case "paymentinfo":
                    this.__showMidContent(undefined, linksource);
                    if (this.LowerContentBodyRegion.currentView.id !== "PaymentInfoLayoutView")
                        this.LowerContentBodyRegion.show(this.__getPaymentInfoLayoutView(), opts);
                    break;
            }
        },
        __bindRegionOnShow: function() {
            this.LowerContentBodyRegion.on("show", function(view, region, options) {
                Events.trigger(Events.hideLoader, view);
                Events.trigger(Events.showScroller);
            });
        }
    });
});