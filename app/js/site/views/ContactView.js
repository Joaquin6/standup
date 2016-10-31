define(['jquery', 'underscore', 'marionette', 'main', 'contact/ContactTemplate.html'], function($, _, Marionette, Main, Template) {
	return Marionette.ItemView.extend({
		id: "ContactView",
		className: "ui segments",
		template: _.template(Template)
	});
});