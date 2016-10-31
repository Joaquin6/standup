define(['jquery', 'underscore', 'marionette', 'home/HomeTemplate.html'], function($, _, Marionette, Template) {
    return Marionette.ItemView.extend({
        id: "HomeViewContent",
        template: _.template(Template),
        onShow: function() {
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