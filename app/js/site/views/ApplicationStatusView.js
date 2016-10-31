define(['jquery', 'underscore', 'marionette', 'main', 'ApplictionStatusTemplate.html'], function($, _, Marionette, Main, Template) {
	return Marionette.ItemView.extend({
		id: "ApplictionStatusView",
		className: "ui segment",
		template: _.template(Template)
	});
});