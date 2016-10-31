define(['jquery', 'underscore', 'marionette', 'dashboard/DashboardTemplate.html'], function($, _, Marionette, Template) {
    return Marionette.ItemView.extend({
        id: "DashboardView",
        template: _.template(Template)
    });
});