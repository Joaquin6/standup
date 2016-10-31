define(['jquery', 'underscore', 'marionette', 'pagevisits/PageVisitsTemplate.html'], function($, _, Marionette, Template) {
	return Marionette.ItemView.extend({
		id: "PageVisitsView",
		className: "ui segment",
		template: _.template(Template),
		onShow: function() {
			if (!this.model.isInitialized()) {
				var that = this;
                this.listenToOnce(this.model, "change:isInitialized", function() {
                    that.__updateContent();
                });
			} else
				this.__updateContent();
		},
		__updateContent: function() {
			var pageviews = this.model.get("pageviews");
			$("#pageviews.value").text(pageviews.toString());

			var uniquevisits = this.model.get("uniquevisits");
			$("#uniquevisits.value").text(uniquevisits.toString());

			var avgtime = this.model.get("avgtime");
			$("#avgtime.value").text(avgtime.toString() + "%");
		}
	});
});