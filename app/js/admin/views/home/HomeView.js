define(['jquery', 'underscore', 'marionette', 'home/HomeTemplate.html'], function($, _, Marionette, Template) {
    return Marionette.ItemView.extend({
        id: "HomeViewContent",
        className: "container-fluid",
        template: _.template(Template)
    });
});