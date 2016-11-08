define(['jquery', 'underscore', 'backbone', 'marionette', 'main', 'views/LoginView', 'models/SessionModel'], function($, _, Backbone, Marionette, Main, LoginView, Session) {
    return Marionette.Object.extend({
        // Routes that need authentication and if user is not authenticated
        // gets redirect to login page
        requiresAuth: ['dashboard', 'myprofile', 'mycampaigns', 'paymentinfo', 'contact', 'topics', 'mynetworks', 'availablecampaigns', 'campaigndetails'],
        // Routes that should not be accessible if user is authenticated
        // for example, login, register, forgetpasword ...
        preventAccessWhenAuth : ['', 'login', 'signup'],
        LoginPage: function(redirect) {
            this.__confirmRoute();
            $('body').empty();
            $('body').attr('data-page', 'loginview');
            var view = new LoginView({
                model: Main.App.Session
            });
            view.render();
        },
        SignupPage: function() {
            this.__confirmRoute();
            $('body').empty();
            $('body').attr('data-page', 'signupview');
            var view = new SignupView({
                model: Main.App.Session.User
            });
            view.render();
        },
        AuthenticatedPage: function() {
            this.__confirmRoute();
            var dataPage = $('body').attr('data-page');
            if (!dataPage || dataPage !== 'baselayout') {
                $('body').attr('data-page', 'baselayout');
                var view = new BaseLayout({
                    model: Main.App.Session
                });
                view.render();
            }
        },
        __confirmRoute: function() {
            // Checking if user is authenticated or not
            // then check the path if the path requires authentication
            var isAuth = Session.get('authenticated');
            var path = Backbone.history.getPath();
            var needAuth = this.__requiresAuth(path);
            var cancelAccess = _.contains(this.preventAccessWhenAuth, path);
            if (needAuth && !isAuth){
                // If user gets redirect to login because wanted to access
                // to a route that requires login, save the path in session
                // to redirect the user back to path after successful login
                Session.set('redirectFrom', path);
                Backbone.history.navigate('login', { trigger : true });
            } else if (isAuth && cancelAccess) {
                // User is authenticated and tries to go to login, register ...
                // so redirect the user to dashboard page
                Backbone.history.navigate('dashboard', { trigger : true });
            }
        },
        __requiresAuth: function(path) {
            var reqAuth = this.requiresAuth;
            var needAuth = _.contains(reqAuth, path);
            if (!needAuth) {
                if (needAuth == undefined)
                    needAuth = false;
                for (var i = 0; i < reqAuth.length; i++) {
                    if (path.indexOf(reqAuth[i]) > -1) {
                        needAuth = true;
                        break;
                    }
                }
            }
            return needAuth;
        }
    });
});