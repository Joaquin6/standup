define(['jquery', 'underscore', 'marionette', 'main', 'layouts/UpcomingCampaignsLayoutTemplate.html', 'views/collections/UpcomingCampaignsCollectionView', 'views/components/UpcomingCampaignItemView', 'views/components/EmptyCampaignsView', 'collections/UpcomingCampaignCollection'], function($, _, Marionette, Main, Template, UpcomingCampaignsCollectionView, UpcomingCampaignItemView, EmptyCampaignsView, UpcomingCampaignCollection) {
    return Marionette.LayoutView.extend({
        id: "UpcomingCampaignsLayoutView",
        className: "ui segment",
        template: _.template(Template),
        regions: {
            UpcomingCampaignsBodyRegion: '#UpcomingCampaignsBody'
        },
        onShow: function() {
            if (!UpcomingCampaignCollection.isInitialized()) {
                var that = this;
                this.listenToOnce(UpcomingCampaignCollection, "isInitialized", function(collection, data) {
                    that.__showCollectionView();
                });
            } else
                this.__showCollectionView();
        },
        __showCollectionView: function() {
            this.UpcomingCampaignsBodyRegion.show(new UpcomingCampaignsCollectionView({
                collection: UpcomingCampaignCollection,
                childView: UpcomingCampaignItemView,
                emptyView: EmptyCampaignsView
            }));
        }
    });
});