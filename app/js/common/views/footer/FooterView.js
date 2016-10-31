define(['jquery', 'underscore', 'marionette', 'footer/FooterTemplate.html'], function($, _, Marionette, Template) {
	return Marionette.ItemView.extend({
		id: "FooterView",
		className: "container",
		template: _.template(Template)
	});
});
