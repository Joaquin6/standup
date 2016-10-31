define(['jquery', 'underscore', 'marionette', 'helpers/events', 'moment', 'mycampaigns/MyCampaignsTemplate.html'], function($, _, Marionette, Events, Moment, Template) {
	return Marionette.ItemView.extend({
		id: "MyCampaignsView",
		template: _.template(Template),
		templateHelpers: {
            formatDate: function(date, format){
                var formattedDate = Moment(date).format('MM/DD/YYYY hh:mm:ss a');
                return formattedDate;
            }
        },
        onShow: function(){
        	var that = this;
			var id = this.model.get("id");
			var $campEl = $('#campaign-' + id);
			$campEl.prop('href', '/campaigndetails');
			$campEl.on("click", function(e){
				e.preventDefault();
				Events.trigger(Events.showCampaignDetails, that.model);
				Events.trigger(Events.navigate, 'campaigndetails');
			});
		}
	});
});