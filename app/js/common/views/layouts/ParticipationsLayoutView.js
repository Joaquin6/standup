define(['jquery', 'underscore', 'marionette', 'main', 'layouts/ParticipationsLayoutTemplate.html', 'views/collections/ParticipationCollectionView', 'views/components/ParticipationItemView', 'collections/ParticipationCollection'], function($, _, Marionette, Main, Template, ParticipationCollectionView, ParticipationItemView, ParticipationCollection) {
    return Marionette.LayoutView.extend({
        id: "ParticipationsLayoutView",
        className: "ui segments",
        template: _.template(Template),
        regions: {
            ParticipationsBodyRegion: '#ParticipationsBody'
        },
        onShow: function() {
            if (!ParticipationCollection.isInitialized())
                this.listenToOnce(ParticipationCollection, "hasSync", this.__showParticipations);
            else
                this.__showParticipations();
        },
        __showParticipations: function() {
            var that = this;
            var collectionView = this.__getCollectionView();
            this.ParticipationsBodyRegion.show(collectionView);
        },
        __getCollectionView: function() {
            var view = new ParticipationCollectionView({
                collection: ParticipationCollection,
                childView: ParticipationItemView
            });
            return view;
        }
    });
});