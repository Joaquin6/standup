define(['jquery', 'underscore', 'backbone', 'marionette', 'main', 'views/HomeView', 'views/LoginView', 'views/SignupView', 'views/layouts/BaseLayout', 'models/SessionModel'], function($, _, Backbone, Marionette, Main, HomeView, LoginView, SignupView, BaseLayout, Session) {
    return Marionette.Object.extend({
        HomePage: function() {
            $('body').attr('data-page', 'homeview');
            var view = new HomeView();
            view.render();
        },
        LoginPage: function(redirect) {
            $('body').empty();
            $('body').attr('data-page', 'loginview');
            var view = new LoginView({
                model: Main.App.Session
            });
            view.render();
        },
        SignupPage: function() {
            $('body').empty();
            $('body').attr('data-page', 'signupview');
            var view = new SignupView({
                model: Main.App.Session.User
            });
            view.render();
        },
        AuthenticatedPage: function() {
            var dataPage = $('body').attr('data-page');
            if (!dataPage || dataPage !== 'baselayout') {
                $('body').attr('data-page', 'baselayout');
                var view = new BaseLayout({
                    model: Main.App.Session
                });
                view.render();
            }
        }
    });
});