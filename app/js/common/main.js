define(['marionette'], function(Marionette) {
    return {
        initialize: function(settings) {
            var App = this.__initializeApplication(settings);
            App.Preamble = App.SiteDesc = this.__getPreamble(settings.siteType);
            App.Title = settings.title;
            App.addInitializer(function(options) {
                var that = this;
                require(['router', 'models/SessionModel'], function(Router, Session) {
                    that.Session = Session;
                    Session.getAuth({
                        preamble: that.SiteDesc
                    }, function(cookie) {
                        that.Router = new Router({
                            routes: options.appRoutes
                        });
                    });
                });
            });
            this.App = App;
            this.App.start(this.__getAppOptions(settings));
        },
        __initializeApplication: function(settings) {
            var App = Marionette.Application.extend({
                fsSettings: settings,
                channelName: 'fsChannel'
            });
            return new App();
        },
        __getPreamble: function(siteType) {
            var lastChar = siteType.slice(-1);
            if (lastChar === 's')
                siteType = siteType.substring(0, siteType.length - 1);
            return siteType;
        },
        __getAppOptions: function(settings) {
            var opts = {};
            if (settings.siteType === 'admin') {
                console.log('>>> Router: Applied Admin Routes');
                opts.appRoutes = {
                    "": "login",
                    "dashboard": "authenticated",
                    "availablecampaigns": "authenticated",
                    "campaigndetails": "authenticated",
                    "*notFound": "unknown"
                };
            } else {
                console.log('>>> Router: Applied Blogger Routes');
                opts.appRoutes = {
                    "": "home",
                    "login": "login",
                    "signup": "signup",
                    "dashboard": "authenticated",
                    "availablecampaigns": "authenticated",
                    "myprofile": "authenticated",
                    "campaigndetails": "authenticated",
                    "mycampaigns": "authenticated",
                    "contact": "authenticated",
                    "topics": "authenticated",
                    "mynetworks": "authenticated",
                    "paymentinfo": "authenticated",
                    "*notFound": "unknown"
                };
            }
            return opts;
        }
    };
});