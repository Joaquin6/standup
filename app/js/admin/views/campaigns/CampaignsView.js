define(['jquery', 'underscore', 'marionette', 'helpers/events', 'moment', 'campaigns/CampaignsTemplate.html'], function($, _, Marionette, Events, Moment, Template) {
	return Marionette.ItemView.extend({
		id: "CampaignsView",
		template: _.template(Template)
	});
});