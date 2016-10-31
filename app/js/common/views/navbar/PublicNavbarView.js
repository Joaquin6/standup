define(['jquery', 'underscore', 'marionette', 'navbar/PublicNavbarTemplate.html'], function($, _, Marionette, Template) {
    return Marionette.ItemView.extend({
        id: "PublicNavbarView",
        className: "ui container",
        template: _.template(Template)
    });
});