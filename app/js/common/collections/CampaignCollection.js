define(['jquery', 'underscore', 'backbone', 'moment', 'helpers/utility', 'helpers/events', 'models/CampaignModel', 'services/io', 'collections/ActiveCampaignCollection', 'collections/UpcomingCampaignCollection', 'collections/CompletedCampaignCollection', 'collections/ClosedCampaignCollection'], function($, _, Backbone, Moment, Utility, Events, Model, io, ActiveCampaignCollection, UpcomingCampaignCollection, CompletedCampaignCollection, ClosedCampaignCollection) {
	var CampaignCollection = Backbone.Collection.extend({
		model : Model,
		hasSync : false,
		url : '/campaigns',
		request : function(userType) {
			var restOpts = {
				excludePreamble: false
			};
			if (!userType)
				userType = "blogger";
			this.hasSync = false;
			this.reset();
			var that = this;
			// Logic is here to handle data coming from performance API.
			// This logic controls if the request will be made to fs.api or
			// performance.api
			if (userType === "admin") {
				this.url = "/performance" + this.url;
				restOpts.excludePreamble = true;
			}
            io.GET(this.url, function(campaigns, status, xhr) {
                console.log('>>> Successful Campaigns Data Responce <<<');
                if (typeof campaigns === "string")
                	campaigns = JSON.parse(campaigns);
                campaigns.forEach(function(campaign, index, arr) {
                	that.addAvailableCampaign(campaign);
                });
                that.__handleInitialized();
            }, function(xhr, status, error) {
                console.log('CampaignCollection: Get Campaigns xhr: ' + xhr);
                console.log('CampaignCollection: Get Campaigns status: ' + status);
                console.log('CampaignCollection: Get Campaigns Error: ' + error);
                if (error === 'Unauthorized')
                    Events.trigger(Events, Events.unauthorized, xhr);
            }, restOpts);
		},
		addCampaign: function(campaign) {
			this.add(campaign);
			if (campaign.status === "Active")
				ActiveCampaignCollection.addCampaign(campaign);
			if (campaign.status === "Upcoming")
				UpcomingCampaignCollection.addCampaign(campaign);
			if (campaign.status === "Completed")
				CompletedCampaignCollection.addCampaign(campaign);
			if (campaign.status === "Closed")
				ClosedCampaignCollection.addCampaign(campaign);
		},
		addAvailableCampaign: function(campaign) {
			// This logic is here to handle campaigns coming from performance API.
			// Which contain an RSID so far.
			if (!campaign.endDate)
				campaign.endDate = Moment().subtract(1, "day").format("YYYY-MM-DD");
			if (!campaign.displayName)
				campaign.displayName = campaign.name;
			if (!campaign.id && campaign.uid)
				campaign.id = campaign.uid;
			this.add(campaign);
			if (campaign.status === 1) {
				var childModel = this.getModelById(campaign.id);
				if (!childModel)
					ActiveCampaignCollection.addCampaign(campaign);
			}
			if (campaign.status === 0) {
				var childModel = this.getModelById(campaign.id);
				if (!childModel)
					UpcomingCampaignCollection.addCampaign(campaign);
			}
		},
		isInitialized: function() {
			return this.hasSync;
		},
		getModelById: function(modelId) {
			var childModel = this.get(modelId);
			if (!childModel) {
				modelId = parseInt(modelId);
				childModel = this.get(modelId);
			}
			if (!childModel)
				childModel = null;
			return childModel;
		},
		__handleInitialized: function() {
			this.hasSync = true;
			this.trigger('isInitialized');
			ActiveCampaignCollection.triggerInitialized();
			UpcomingCampaignCollection.triggerInitialized();
			CompletedCampaignCollection.triggerInitialized();
			ClosedCampaignCollection.triggerInitialized();
		}
	});
	return new CampaignCollection();
});
