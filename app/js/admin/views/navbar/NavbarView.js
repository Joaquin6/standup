define(['jquery', 'underscore', 'marionette', 'helpers/events', 'navbar/NavbarTemplate.html'], function($, _, Marionette, Events, Template) {
    return Marionette.ItemView.extend({
        el: "#NavbarView",
        className: "ui fluid container",
        template: _.template(Template),
        events: {
            "click #linkUserLogout": function() {
                this.model.logout();
            }
        },
        onRender: function() {
            $('#fsNavBrand').prop('href', location.pathname);
            $("#linkUserLogout");
            Events.trigger(Events.onRenderedSideNavToggle);
        }
    });
});