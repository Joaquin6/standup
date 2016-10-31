define(['jquery', 'underscore', 'marionette', 'helpers/events', 'helpers/utility', 'layouts/ContentBodyLayoutTemplate.html', 'views/components/TitleView', 'views/statistics/StatisticsView', 'views/statistics/StatisticsChartsView', 'views/layouts/AvailableCampaignsLayoutView', 'views/campaigns/CampaignDetailsView', 'views/pagevisits/PageVisitsView', 'models/StatisticsModel', 'models/ImpressionsModel', 'models/PageVisitsModel', 'collections/CampaignCollection'], function($, _, Marionette, Events, Utility, Template, TitleView, StatisticsView, StatisticsChartsView, AvailableCampaignsLayoutView, CampaignDetailsView, PageVisitsView, StatisticsModel, ImpressionsModel, PageVisitsModel, CampaignCollection) {
    return Marionette.BaseView.extend({
        __views: {},
        __auth: true,
        __template: null,
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
            if (!CampaignCollection.isInitialized()) {
                this.listenToOnce(CampaignCollection, "isInitialized", function() {
                    StatisticsModel.collect();
                });
            }
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
        onShowCampaignDetails: function(campaign) {
            var linksource = 'campaigndetails';
            ImpressionsModel.collect({uid: campaign.get("uid")});
            this.__handleBodyViewSwap(linksource, campaign);
        },
        onSidebarToggle: function(data) {
            this.__handleEventResizeData(data);
            this.resizeWidth(data);
            this.resize(true);
        },
        onResize: function(data) {
            this.__handleEventResizeData(data);
            this.resizeWidth(data);
            this.resize(true);
        },
        resizeWidth: function(data) {
            var contentBodyWidth;
            if (data.action === 'hidden') {
                contentBodyWidth = data.contentWidth;
            } else {
                contentBodyWidth = data.contentWidth - data.sidebarWidth;
            }
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
            if (!data) {
                data = {};
            }
            if (!data.action) {
                data.action = 'shown';
                if (!Utility.isSidebarVisible()) {
                    data.action = 'hidden';
                }
            }
            if (!data.contentWidth) {
                data.contentWidth = this.$el.closest('.pushable').width();
            }
            if (!data.sidebarWidth) {
                data.sidebarWidth = $('.vertical.sidebar.menu').width();
            }
        },
        __getProperPathView: function() {
            var that = this, view;
            if (location.pathname.indexOf("/dashboard") > -1)
                view = this.__getParticipationCollectionView();
            else if (location.pathname.indexOf("/availablecampaigns") > -1)
                view = this.__getAvailableCampaignsLayoutView();
            return view;
        },
        __handleMiddleContent: function(reset) {
            var pathname = location.pathname;
            if (pathname.indexOf("/dashboard") > -1) {
                if (!StatisticsModel.isInitialized()) {
                    var that = this;
                    this.listenToOnce(StatisticsModel, "change:isInitialized", function() {
                        that.__showMidContent(reset);
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
            var pathname = location.pathname;
            if (pathname.indexOf("/dashboard") > -1) {
                this.__hideLowerContent();
                return;
                if (!StatisticsModel.isInitialized()) {
                    var that = this;
                    this.listenToOnce(StatisticsModel, "change:isInitialized", function() {
                        that.__showLowerContent(reset);
                    });
                } else {
                    this.__showLowerContent(reset);
                }
            } else {
                this.__hideLowerContent();
            }
        },
        __showMidContent: function(reset, linksource) {
            var pathname = location.pathname, view;
            if (linksource && typeof linksource === 'string')
                pathname = '/' + linksource;

            if (pathname.indexOf("/dashboard") > -1)
                view = this.__getStatisticsChartsView(reset);
            else if (pathname.indexOf("/availablecampaigns") > -1)
                view = this.__getAvailableCampaignsLayoutView(reset);
            else if (pathname.indexOf("/campaigndetails") > -1)
                view = this.__getPageVisitsView(reset);

            if (reset || !this.MiddleContentBodyRegion.hasView())
                this.MiddleContentBodyRegion.show(view);
            else
                this.MiddleContentBodyRegion.show(view, {preventDestroy: true});
        },
        __showLowerContent: function(reset, linksource) {
            this.__bindRegionOnShow();
            var pathname = location.pathname, view;
            if (linksource && typeof linksource === 'string')
                pathname = '/' + linksource;

            // if (pathname.indexOf("/dashboard") > -1)
            //     view = this.__getSocialImpressionsLineChartView(reset);

            if (reset || !this.LowerContentBodyRegion.hasView())
                this.LowerContentBodyRegion.show(view);
            else
                this.LowerContentBodyRegion.show(view, {preventDestroy: true});
        },
        __hideMidContent: function() {
            if (this.MiddleContentBodyRegion.hasView())
                this.MiddleContentBodyRegion.empty({preventDestroy: true});
        },
        __hideLowerContent: function() {
            if (this.LowerContentBodyRegion.hasView())
                this.LowerContentBodyRegion.empty({preventDestroy: true});
            Events.trigger(Events.hideLoader);
        },
        __getTitleView: function(reset) {
            var view;
            if (!reset && this.__views.titleView)
                view = this.__views.titleView;
            else
                view = this.__views.titleView = new TitleView();
            return view;
        },
        __getStatisticsView: function(reset) {
            var view;
            if (!reset && this.__views.statisticsView)
                view = this.__views.statisticsView;
            else {
                view = this.__views.statisticsView = new StatisticsView({
                    model: StatisticsModel
                });
            }
            return view;
        },
        __getStatisticsChartsView: function(reset) {
            var view;
            if (!reset && this.__views.statisticsChartsView)
                view = this.__views.statisticsChartsView;
            else {
                view = this.__views.statisticsChartsView = new StatisticsChartsView({
                    model: StatisticsModel
                });
            }
            return view;
        },
        __getSocialImpressionsLineChartView: function(reset) {
            var view;
            if (!reset && this.__views.socialImpressionsLineChartView)
                view = this.__views.socialImpressionsLineChartView;
            else {
                view = this.__views.socialImpressionsLineChartView = new SocialImpressionsLineChartView({
                    model: StatisticsModel
                });
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
        __getPageVisitsView: function(reset, campaign) {
            var model = PageVisitsModel;
            var view;
            if (!reset && this.__views.pageVisitsView)
                view = this.__views.pageVisitsView;
            else {
                if (campaign) {
                    model = new PageVisitsModel();
                    model.request({rsid: campaign.get("rsid")});
                }
                view = this.__views.pageVisitsView = new PageVisitsView({
                    model: model
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
                    this.__showMidContent(false, linksource);
                    this.__hideLowerContent();
                    break;
                case "availablecampaigns":
                    this.__showMidContent(false, linksource);
                    this.__hideLowerContent();
                    break;
                case "campaigndetails":
                    if (this.MiddleContentBodyRegion.currentView.id !== "PageVisitsView")
                        this.MiddleContentBodyRegion.show(this.__getPageVisitsView(false, params), opts);
                    this.LowerContentBodyRegion.show(this.__getCampaignDetailsView(undefined, params), opts);
                    break;
            }
        },
        __bindRegionOnShow: function() {
            var that = this;
            this.LowerContentBodyRegion.on("show", function(view, region, options) {
                Events.trigger(Events.hideLoader, view);
                Events.trigger(Events.showScroller);
            });
        }
    });
});