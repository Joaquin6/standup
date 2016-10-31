define(['jquery', 'underscore', 'marionette', 'helpers/events', 'components/UpcomingCampaignItemTemplate.html'], function($, _, Marionette, Events, Template) {
	return Marionette.ItemView.extend({
		id: "UpcomingCampaignItemView",
		template: _.template(Template),
		onShow: function(){
			var campaignId = this.model.get("id");
			var $campEl = $('#campaign-' + campaignId);
			$campEl.prop('href', '/campaigndetails');
			$campEl.on("click", function(e){
				e.preventDefault();
				Events.trigger(Events.showCampaignDetails, campaign);
				Events.trigger(Events.navigate, 'campaigndetails');
			});
		}
	});
});