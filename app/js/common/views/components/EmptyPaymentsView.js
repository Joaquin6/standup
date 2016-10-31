define(['jquery', 'underscore', 'marionette'], function($, _, Marionette) {
	return Marionette.ItemView.extend({
		id: "EmptyPaymentsView",
		className: "text-center",
		template: _.template("<p><strong>There are no payments</strong></p>")
	});
});