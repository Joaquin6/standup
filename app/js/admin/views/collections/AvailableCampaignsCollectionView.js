define(['jquery', 'underscore', 'marionette'], function($, _, Marionette) {
    return Marionette.CollectionView.extend({
		id: "AvailableCampaignsCollectionView",
		className: "ui styled fluid accordion",
		onRender: function() {
			var options = {
				selector: {
					trigger: '#AvailableCampaignItemAccordionTitle'
				},
				debug: true
			};
			this.$el.accordion(options);
        }
    });
});