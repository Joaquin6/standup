define(['jquery', 'underscore', 'marionette', 'helpers/utility', 'moment', 'campaigndetails/CampaignDetailsTemplate.html'], function($, _, Marionette, Utility, Moment, Template) {
	return Marionette.ItemView.extend({
		id: "CampaignDetailsView",
		className: "ui segment",
		template: _.template(Template),
		templateHelpers: {
			formatCurrency: function(val) {
				var formattedCurrency = Utility.formatCurrency(val);
				return formattedCurrency;
			},
            formatDate: function(paidDate){
            	if (paidDate === 'N/A')
            		return paidDate;
                var formattedDate = Moment(paidDate).format('MM/DD/YYYY');
                return formattedDate;
            }
        }
	});
});