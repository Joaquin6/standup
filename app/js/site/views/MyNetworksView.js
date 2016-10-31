define(['jquery', 'underscore', 'marionette', 'mynetworks/MyNetworksTemplate.html'], function($, _, Marionette, Template) {
	return Marionette.ItemView.extend({
		id: "MyNetworksView",
		className: "ui segments",
		template: _.template(Template)
	});
});