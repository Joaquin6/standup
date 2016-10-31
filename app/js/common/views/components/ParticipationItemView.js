define(['jquery', 'underscore', 'marionette', 'helpers/events', 'components/ParticipationItemTemplate.html'], function($, _, Marionette, Events, Template) {
	return Marionette.ItemView.extend({
		id: "ParticipationItemView",
		className: "ui clearing segment",
		template: _.template(Template),
		onShow: function(){
			var campaign = this.model.get("campaign");
			var $campEl = $('#campaign-' + campaign.id);
			$campEl.prop('href', '/campaigndetails');
			$campEl.on("click", function(e){
				e.preventDefault();
				Events.trigger(Events.showCampaignDetails, campaign);
				Events.trigger(Events.navigate, 'campaigndetails');
			});
		}
	});
});