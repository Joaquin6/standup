define(['jquery', 'underscore', 'marionette', 'helpers/events', 'helpers/utility'], function($, _, Marionette, Events, Utility) {
    return Marionette.CollectionView.extend({
        id: "ParticipationCollectionView",
        className: "ui fluid accordion",
        onShow: function() {
        	var options = {
				selector: {
					trigger: '#ParticipationItemAccordionTitle'
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