define(['jquery', 'underscore', 'backbone', 'marionette', 'services/controller', 'models/SessionModel'], function($, _, Backbone, Marionette, RouterController, Session) {
    var AppRouter = Marionette.AppRouter.extend({
        // Routes that need authentication and if user is not authenticated
        // gets redirect to login page
        requiresAuth: ['dashboard', 'myprofile', 'mycampaigns', 'paymentinfo', 'contact', 'topics', 'mynetworks', 'availablecampaigns', 'campaigndetails'],
        // Routes that should not be accessible if user is authenticated
        // for example, login, register, forgetpasword ...
        preventAccessWhenAuth : ['', 'login', 'signup'],
        controller: null,
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
        route : function(route, name, callback){
            if (!_.isRegExp(route)) route = this._routeToRegExp(route);
            if (_.isFunction(name)) {
                callback = name;
                name = '';
            }
            if (!callback) callback = this[name];

            var router = this;

            Backbone.history.route(route, function(fragment) {
                var args = router._extractParameters(route, fragment);
                var next = function(){
                    callback && callback.apply(router, args);
                    router.trigger.apply(router, ['route:' + name].concat(args));
                    router.trigger('route', name, args);
                    Backbone.history.trigger('route', router, name, args);
                }
                router.before.apply(router, [args, next]);
            });
            return this;
        },
        before: function(params, next) {
            // Checking if user is authenticated or not
            // then check the path if the path requires authentication
            var isAuth = Session.get('authenticated');
            var path = Backbone.history.getPath();
            var needAuth = this.__requiresAuth(path);
            var preventAccess = _.contains(this.preventAccessWhenAuth, path);
            if (needAuth && !isAuth){
                // If user gets redirect to login because wanted to access
                // to a route that requires login, save the path in session
                // to redirect the user back to path after successful login
                Session.set('redirectFrom', path);
                Backbone.history.navigate('login', { trigger : true });
            } else if (isAuth && preventAccess) {
                // User is authenticated and tries to go to login, register ...
                // so redirect the user to dashboard page
                Backbone.history.navigate('dashboard', { trigger : true });
            } else {
                return next();
            }
        },
        unknown : function() {
            Backbone.history.navigate('', { trigger : true });
        },
        home: function() {
            this.controller.HomePage();
        },
        login: function() {
            this.controller.LoginPage();
        },
        signup: function() {
            this.controller.SignupPage();
        },
        authenticated: function() {
            this.controller.AuthenticatedPage();
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
    return AppRouter;
});
