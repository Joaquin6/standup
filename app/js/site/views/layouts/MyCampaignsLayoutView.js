define(['jquery', 'underscore', 'marionette', 'main', 'layouts/MyCampaignsLayoutTemplate.html', 'views/collections/MyCampaignsCollectionView', 'collections/ActiveCampaignCollection', 'collections/UpcomingCampaignCollection', 'collections/CompletedCampaignCollection', 'collections/ClosedCampaignCollection'], function($, _, Marionette, Main, Template, MyCampaignsCollectionView, ActiveCampaignCollection, UpcomingCampaignCollection, CompletedCampaignCollection, ClosedCampaignCollection) {
    return Marionette.LayoutView.extend({
        __views: {},
        id: "MyCampaignsLayoutView",
        className: "ui segments",
        template: _.template(Template),
        regions: {
            CurrentCampaignsRegion: '#CurrentCampaignsRegion',
            ComingSoonCampaignsRegion: '#ComingSoonCampaignsRegion',
            CompletedCampaignsRegion: '#CompletedCampaignsRegion',
            ClosedCampaignsRegion: '#ClosedCampaignsRegion'
        },
        onShow: function() {
            this.__handleCurrentCampaigns();
            this.__handleComingSoonCampaigns();
            this.__handleCompletedCampaigns();
            this.__handleClosedCampaigns();
		},
        __handleCurrentCampaigns: function() {
            this.CurrentCampaignsRegion.show(this.__getCurrentCampaignsCollectionView());
        },
        __handleComingSoonCampaigns: function() {
            this.ComingSoonCampaignsRegion.show(this.__getComingSoonCampaignsCollectionView());
        },
        __handleCompletedCampaigns: function() {
            this.CompletedCampaignsRegion.show(this.__getCompletedCampaignsCollectionView());
        },
        __handleClosedCampaigns: function() {
            this.ClosedCampaignsRegion.show(this.__getClosedCampaignsCollectionView());
        },
        __getCurrentCampaignsCollectionView: function() {
            var view = new MyCampaignsCollectionView({
                collection: ActiveCampaignCollection
            });
            return view;
        },
        __getComingSoonCampaignsCollectionView: function() {
            var view = new MyCampaignsCollectionView({
                collection: UpcomingCampaignCollection
            });
            return view;
        },
        __getCompletedCampaignsCollectionView: function() {
            var view = new MyCampaignsCollectionView({
                collection: CompletedCampaignCollection
            });
            return view;
        },
        __getClosedCampaignsCollectionView: function() {
            var view = new MyCampaignsCollectionView({
                collection: ClosedCampaignCollection
            });
            return view;
        }
    });
});