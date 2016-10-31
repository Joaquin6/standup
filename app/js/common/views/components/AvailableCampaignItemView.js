define(['jquery', 'underscore', 'marionette', 'helpers/events', 'components/AvailableCampaignItemTemplate.html'], function($, _, Marionette, Events, Template) {
	return Marionette.ItemView.extend({
		id: "AvailableCampaignItemView",
		template: _.template(Template),
		templateHelpers: {
			formatStatus: function(status) {
				if (status === 0) {
					return "New";
				} else if (status === 1) {
					return "Active";
				} else {
					return "Inactive";
				}
			}
        },
		onShow: function(){
			var that = this;
			var campaignId = this.model.get("uid");
			var $campEl = $('#campaign-' + campaignId);
			$campEl.prop('href', '/campaigndetails');
			$campEl.on("click", function(e){
				e.preventDefault();
				Events.trigger(Events.showCampaignDetails, that.model);
			});
		}
	});
});