define(['jquery', 'underscore', 'marionette', 'helpers/events', 'helpers/utility', 'views/mycampaigns/MyCampaignsView', 'views/components/EmptyCampaignsView'], function($, _, Marionette, Events, Utility, MyCampaignsView, EmptyCampaignsView) {
    return Marionette.CollectionView.extend({
        id: "MyCampaignsCollectionView",
        className: "ui accordion",
        childView: MyCampaignsView,
        emptyView: EmptyCampaignsView,
        onRender: function() {
        	var options = {
				selector: {
					trigger: '#CampaignItemAccordionTitle'
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