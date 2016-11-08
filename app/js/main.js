define(['marionette'], function(Marionette) {
    return {
        initialize: function(settings) {
            this.App = this.__initializeApplication();
            this.App.start();
        },
        __initializeApplication: function() {
            var App = Marionette.Application.extend({
                Title: "Vision Wheel Dealers",
                channelName: 'fsChannel',
                onStart: function(options) {
                    options = options || {};
                    var that = this;
                    require(['router', 'models/SessionModel'], function(Router, Session) {
                        that.Session = Session;
                        Session.getAuth({
                            preamble: that.SiteDesc
                        }, function() {
                            that.Router = new Router();
                        });
                    });
                }
            });
            return new App();
        }
    };
});