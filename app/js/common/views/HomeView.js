define(['jquery', 'underscore', 'marionette', 'home/HomeTemplate.html'], function($, _, Marionette, Template) {
	return Marionette.ItemView.extend({
		el: "body",
		template: _.template(Template),
        onBeforeRender: function() {
            $(this.el).addClass('pushable');
        },
		onRender: function() {
            $(this.el).addClass('pushable');
            // fix menu when passed
            $('.masthead').visibility({
                once: false,
                onBottomPassed: function() {
                    $('.fixed.menu').transition('fade in');
                },
                onBottomPassedReverse: function() {
                    $('.fixed.menu').transition('fade out');
                }
            });
            // create sidebar and attach to menu open
            $('.ui.sidebar').sidebar('attach events', '.toc.item');
        }
	});
});