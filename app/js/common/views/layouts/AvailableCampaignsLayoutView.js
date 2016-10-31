define(['jquery', 'underscore', 'marionette', 'main', 'layouts/AvailableCampaignsLayoutTemplate.html', 'views/collections/AvailableCampaignsCollectionView', 'views/components/AvailableCampaignItemView', 'views/components/EmptyCampaignsView', 'collections/CampaignCollection', 'collections/ActiveCampaignCollection'], function($, _, Marionette, Main, Template, AvailableCampaignsCollectionView, AvailableCampaignItemView, EmptyCampaignsView, CampaignCollection, ActiveCampaignCollection) {
    return Marionette.LayoutView.extend({
        id: "AvailableCampaignsLayoutView",
        className: "ui segments",
        template: _.template(Template),
        regions: {
            AvailableCampaignsBodyRegion: '#AvailableCampaignsBody'
        },
        onShow: function() {
            var User = Main.App.Session.User;
            var userType = User.get("userType");
            var Collector = ActiveCampaignCollection;
            if (userType === "admin")
                Collector = CampaignCollection;
            if (!Collector.isInitialized()) {
                var that = this;
                this.listenToOnce(Collector, "isInitialized", function(collection, data) {
                    that.__showCollectionView(User, Collector);
                });
            } else
                this.__showCollectionView(User, Collector);
        },
        __showCollectionView: function(user, collector) {
            this.AvailableCampaignsBodyRegion.show(new AvailableCampaignsCollectionView({
                collection: collector,
                childView: AvailableCampaignItemView,
                emptyView: EmptyCampaignsView
            }));
        }
    });
});