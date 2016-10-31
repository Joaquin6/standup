define(['jquery', 'underscore', 'backbone', 'helpers/utility', 'helpers/events', 'models/PaymentModel', 'services/io'], function($, _, Backbone, Utility, Events, Model, io) {
	var PaymentCollection = Backbone.Collection.extend({
		model : Model,
		hasSync : false,
		userId: null,
		sort_key : '_id',
		url : '/payments',
		request : function(options) {
			if (options && options.userId)
				this.userId = options.userId;

			this.hasSync = false;
			this.reset();
			this.url = this.url + '/user/' + this.userId;

			var that = this;
            io.GET(this.url, function(payments, status, xhr) {
                if (status == "success") {
                	if (!Utility.isProductionEnv()) {
	                    console.log('>>> Successful Payments Data Responce <<<');
	                    console.dir(payments);
	                }
                    payments.forEach(function(payment, index, arr) {
                    	if (!payment.paidDate)
                    		payment.paidDate = 'N/A';
                    	if (!payment.errorMessage)
                    		payment.errorMessage = 'N/A';
                    	that.add(payment);
                    });
                    that.hasSync = true;
                }
            }, function(xhr, status, error) {
            	if (!Utility.isProductionEnv()) {
	                console.log('PaymentCollection: Get Participations xhr: ' + xhr);
	                console.log('PaymentCollection: Get Participations status: ' + status);
	                console.log('PaymentCollection: Get Participations Error: ' + error);
	            }
                if (error === 'Unauthorized')
                    Events.trigger(Events, Events.unauthorized, xhr);
            });
		}
	});
	return new PaymentCollection();
});
