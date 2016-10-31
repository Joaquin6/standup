define(['jquery', 'underscore', 'backbone', 'main', 'helpers/utility', 'helpers/events', 'models/ParticipationModel', 'services/io', 'collections/CampaignCollection'], function($, _, Backbone, Main, Utility, Events, Model, io, CampaignCollection) {
	var ParticipationCollection = Backbone.Collection.extend({
		model : Model,
		hasSync : false,
		userId: null,
		sort_key : '_id',
		url : '/participations',
		request : function(options) {
			if (options && options.userId)
				this.userId = options.userId;

			this.hasSync = false;
			this.reset();
			this.url = '/users/' + this.userId + this.url;

			var User = Main.App.Session.User;
			var userType = User.get("userType");

			var that = this;
            console.time("PARTICIPATIONS API CALL");
            io.GET(this.url, function(participations, status, xhr) {
            	that.listenToOnce(CampaignCollection, "isInitialized", that.__changeSync);
        		console.timeEnd("PARTICIPATIONS API CALL");
                console.log('>>> Successful Participations Data Responce <<<');
                console.dir(participations);
                participations.forEach(function(participation, index, arr) {
                	that.add(participation);
                	if (userType !== "admin")
                		that.__addToCampaigns(participation);
                });
                CampaignCollection.request(userType);
            }, function(xhr, status, error) {
            	if (!Utility.isProductionEnv()) {
	                console.log('ParticipationCollection: Get Participations xhr: ' + xhr);
	                console.log('ParticipationCollection: Get Participations status: ' + status);
	                console.log('ParticipationCollection: Get Participations Error: ' + error);
	            }
                if (error === 'Unauthorized')
                    Events.trigger(Events, Events.unauthorized, xhr);
            });
		},
		isInitialized: function() {
			return this.hasSync;
		},
		__changeSync: function() {
			this.hasSync = true;
			this.trigger('hasSync');
		},
		__addToCampaigns: function(participation) {
			var campaign = participation.campaign;
			if (campaign)
				CampaignCollection.addCampaign(campaign);
		}
	});
	return new ParticipationCollection();
});
