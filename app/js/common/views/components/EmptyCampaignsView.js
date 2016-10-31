define(['jquery', 'underscore', 'marionette'], function($, _, Marionette) {
	return Marionette.ItemView.extend({
		id: "EmptyCampaignsView",
		className: "ui message",
		template: _.template("<div class='header'>There are no campaigns</div>")
	});
});