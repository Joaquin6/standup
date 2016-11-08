define(['jquery', 'underscore', 'marionette', 'home/HomeTemplate.html'], function($, _, Marionette, Template) {
	return Marionette.View.extend({
		el: "body",
		template: _.template(Template),
		onRender: function() {
            console.log("Home View Rendered");
        }
	});
});