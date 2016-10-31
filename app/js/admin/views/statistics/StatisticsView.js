define(['jquery', 'underscore', 'marionette', 'statistics/StatisticsTemplate.html'], function($, _, Marionette, Template) {
	return Marionette.ItemView.extend({
		id: "StatisticsView",
		className: "ui segment",
		template: _.template(Template)
	});
});