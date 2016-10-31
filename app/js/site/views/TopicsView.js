define(['jquery', 'underscore', 'marionette', 'topics/TopicsTemplate.html'], function($, _, Marionette, Template) {
	return Marionette.ItemView.extend({
		id: "TopicsView",
		className: "ui segments",
		template: _.template(Template),
		onShow: function() {
			$('.ui.toggle.checkbox').checkbox();
			var topics = this.model.get('topics');
			if (!topics)
				this.listenToOnce(this.model, "change:isInitialized", this.__handleTopicsCheckboxes);
			else
				this.__handleTopicsCheckboxes();
		},
		__handleTopicsCheckboxes: function() {
			var topics = this.model.get('topics');
			topics.forEach(function(topic, index) {
				if (topic.isActive) {
					var labelEl = $('#' + this.id).find('label:contains(' + topic.displayName + ')');
					if (labelEl.length > 0) {
						var chkbox = $(labelEl).parent('.ui.toggle.checkbox');
						$(chkbox).checkbox('toggle');
					}
				}
			}, this);
		}
	});
});