define(['jquery', 'underscore', 'backbone', 'helpers/utility', 'models/CampaignModel', 'services/io'], function($, _, Backbone, Utility, Model, io) {
	var ActiveCampaignCollection = Backbone.Collection.extend({
		model : Model,
		hasSync : false,
		sort_key : '_id',
		url : '/campaigns',
		addCampaign: function(campaign) {
			if (campaign.status !== "Active")
				return;
			this.add(campaign);
		},
		isInitialized: function() {
			return this.hasSync;
		},
		triggerInitialized: function() {
			this.hasSync = true;
			this.trigger('isInitialized');
		}
	});
	return new ActiveCampaignCollection();
});
