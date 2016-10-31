define(['jquery', 'underscore', 'marionette', 'moment', 'paymentinfo/PaymentItemTemplate.html'], function($, _, Marionette, Moment, Template) {
	return Marionette.ItemView.extend({
		tagName: "tr",
		id: "PaymentItemView",
		template: _.template(Template),
		templateHelpers: {
			formatAmount: function(amount){
                return '$' + amount;
            },
            formatDate: function(paidDate){
            	if (paidDate === 'N/A')
            		return paidDate;
                var formattedDate = Moment(paidDate).format('YYYY/MM/DD');
                return formattedDate;
            }
        }
	});
});