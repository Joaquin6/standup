define(['jquery', 'underscore', 'marionette', 'helpers/events', 'helpers/utility'], function($, _, Marionette, Events, Utility) {
    return Marionette.CollectionView.extend({
        id: "UpcomingCampaignsCollectionView",
        className: "ui accordion",
        onRender: function() {
        	var options = {
				selector: {
					trigger: '#UpcomingCampaignItemAccordionTitle'
				}
			};
			if (!Utility.isProductionEnv())
				options.debug = true;
			this.$el.accordion(options);
            var data = {};
            data.action = 'shown';
            Events.trigger(Events.sidebarToggled, data);
        }
    });
});