define(['jquery', 'underscore', 'marionette', 'PaymentStatusTemplate.html'], function($, _, Marionette, Template) {
	return Marionette.ItemView.extend({
		id: "PaymentStatusView",
		className: "ui segment",
		template: _.template(Template)
	});
});