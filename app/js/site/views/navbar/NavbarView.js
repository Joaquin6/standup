define(['jquery', 'underscore', 'marionette', 'helpers/events', 'navbar/NavbarTemplate.html'], function($, _, Marionette, Events, Template) {
    return Marionette.ItemView.extend({
        el: "#NavbarView",
        className: "ui fluid container",
        template: _.template(Template),
        onRender: function() {
            $('#fsNavBrand').prop('href', location.pathname);
            this.__initDropdown();
            Events.trigger(Events.onRenderedSideNavToggle);
        },
        __initDropdown: function() {
            var that = this;
            $('#UserMenuDropdown').dropdown({
                action: function(text, value) {
                    if (value === "logout")
                        that.model.logout();
                    else
                        Events.trigger(Events.navigate, value);
                }
            });
        }
    });
});