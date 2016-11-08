define(['jquery', 'underscore', 'backbone', 'marionette', 'services/controller'], function($, _, Backbone, Marionette, RouterController) {
    var AppRouter = Marionette.AppRouter.extend({
        controller: null,
        routes: {
            "": "login",
            "signup": "signup",
            "*notFound": "unknown"
        },
        initialize: function() {
            this.controller = new RouterController();
            // this allows you to disable postback - if you do want postback - then set data-bypass on link
            $("body").on("click", "a:not(a[data-bypass])", function(e) {
                e.preventDefault();
                var href = $(this).attr("href");
                Backbone.history.navigate(href, true);
            });
            Backbone.history.start({
                root: '/',
                pushState: true
            });
        },
        unknown : function() {
            Backbone.history.navigate('', { trigger : true });
        },
        login: function() {
            this.controller.LoginPage();
        },
        signup: function() {
            this.controller.SignupPage();
        },
        authenticated: function() {
            this.controller.AuthenticatedPage();
        }
    });
    return AppRouter;
});
