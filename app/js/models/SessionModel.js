define(['jquery', 'underscore', 'backbone', 'main', 'moment', 'helpers/utility', 'helpers/events', 'models/UserModel', 'services/io'], function($, _, Backbone, Main, Moment, Utility, Events, UserModel, io) {
    var sessionModel = Backbone.Model.extend({
        User: null,
        url: '/',
        defaults: {
            countDownSeconds: 300,
            secondsBeforePrompt: null,
            sessionTimeoutSeconds: null,
            notifyUser: false
        },
        sessionTimers: {
            promptToExtendSessionTimeoutId: null,
            displayCountdownIntervalId: null
        },
        initialize: function() {
            _.bindAll(this, '__countdown');
            var siteDesc = Main.App.SiteDesc || null;
            this.set('siteType', siteDesc);
            var sessionCookie = Utility.getPersistence('vwSession') || null;
            var userCookie = Utility.getPersistence('vwUser') || null;
            io.initialize({sessionCookie: sessionCookie});

            this.User = new UserModel({
                sessionCookie: sessionCookie,
                userCookie: userCookie,
                userType: siteDesc
            });

            this.listenTo(this.User, "logout", this.logout);
            this.listenTo(this.User, "signupSuccess", this.onSignupSuccess);
            this.listenTo(Events, Events.unauthorized, this.onUnauthorized);
            this.listenTo(Events, Events.refreshSession, this.refreshSession);
        },
        initializeSession: function(params) {
            Utility.setPersistence('vwSession', params);
            var token = Moment(params.expires);
            var sessionTimeoutSeconds = parseInt(Moment().to(token, true)) * 60;
            this.set('sessionTimeoutSeconds', sessionTimeoutSeconds);
            var secondsBeforePrompt = sessionTimeoutSeconds - this.__getCountdownSeconds();
            var refreshToken = Moment(params.refreshExpires);

            console.groupCollapsed('>>> Session Token Data');
            console.log('Token Expiration Time: ' + token.format('MM/DD/YYYY hh:mm:ss a'));
            console.log('Token Expires: ' + Moment().to(token));
            console.log('Refresh Token Expiration Time: ' + refreshToken.format('MM/DD/YYYY hh:mm:ss a'));
            console.log('Refresh Token Expires: ' + Moment().to(refreshToken));
            console.groupEnd();
            // This can be removed but it is only for debugging a quick session modal
            // Means Session Ending Dialog will be triggered every 25 min instead
            // secondsBeforePrompt = 25;

            if (Utility.isQAEnv())
                secondsBeforePrompt = 300;
            this.set('secondsBeforePrompt', secondsBeforePrompt);
            this.__startSessionManager();
        },
        updateSession: function(data) {
            var accnt;
            if (data.account)
                accnt = data.account;

            this.__setupHandlers(data);

            if (accnt)
                this.User.onUserAccount(accnt);
        },
        setTokens: function(data) {
            if (data.account)
                delete data.account;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    this.set(key, data[key]);
                }
            }
        },
        login: function(payload) {
            Utility.setPersistence('vwLogin', payload.email);
            var that = this;
            io.POST('/auth/login', payload, function(data, status, xhr) {
                var isSuccess = true;
                var path = 'dashboard';
                var res = {};
                res.data = data;
                res.status = status || null;
                if (res.data.statusCode) {
                    if (typeof res.data.statusCode === "string")
                        res.data.statusCode = parseInt(res.data.statusCode);
                    if (res.data.statusCode === 401) {
                        isSuccess = false;
                        res.status = "error";
                        res.data.title = Utility.capitalizeFirstLetter(res.status) + ': ' + res.data.message;
                        Utility.removePersistence('vwLogin');
                    }
                }
                if (typeof res.data === "string") {
                    if (data.indexOf('<html>') > -1) {
                        isSuccess = false;
                        res.status = "error";
                        res.data = {};
                        res.data.message = 'IT has been notified of this error. Please try again later.';
                        res.data.title = Utility.capitalizeFirstLetter(res.status) + ': Unable to Connect.';
                        Utility.removePersistence('vwLogin');
                    }
                }
                that.set('loginResponse', res);
                if (isSuccess === false)
                    return;
                var data = res.data;
                var json = {};
                if (res.data.token) {
                    json.token = data.token;
                    json.user_id = data.account.user;
                    if (this.get('redirectFrom')) {
                        path = this.get('redirectFrom');
                        this.unset('redirectFrom');
                    }
                    if (!Utility.isProductionEnv()) {
                        console.info('>>> Successful User Account And Token Responce <<<');
                        console.dir(res);
                    }
                    this.set('authenticated', true);
                    setTimeout(function() {
                        Backbone.history.navigate(path, true);
                    }, 1000);
                    this.updateSession(res.data);
                }
            }, function(xhr, status, error) {
                var res = {};
                res.status = status;
                res.data = {};
                res.data.title = Utility.capitalizeFirstLetter(status) + ': ' + error;
                res.data.message = 'Invalid Login';
                console.log('>>> Bad User Account And Token Responce <<<');
                console.dir(res);
                that.set('loginResponse', res);
                Utility.removePersistence('vwLogin');
            });
        },
        logout: function(urlLink) {
            this.stopListening();
            Utility.removePersistence('vwSession');
            Utility.removePersistence('vwUser');
            this.clear();
            this.unset('authenticated');
            var nav = '';
            if (urlLink)
                nav = urlLink;
            Backbone.history.navigate(nav, true);
        },
        getAuth: function(options, callback) {
            var cookie = Utility.getPersistence('vwSession');
            if (cookie == undefined) {
                this.clear();
                callback();
            } else if (cookie.token) {
                this.set('authenticated', true);
                var accnt = Utility.getPersistence('vwUser');
                if (accnt)
                    this.User.setAccount(accnt);
                callback(cookie);
            }
        },
        getUserAccount: function() {
            return this.User.get('account');
        },
        onUnauthorized: function(xhr) {
            if (!Utility.isProductionEnv()) {
                console.log('Session Model Detected Unauthorized Session! Need to log back in');
                if (xhr)
                    console.log(JSON.stringify(xhr));
            }
            this.User.clear({silent:true});
            this.logout('login');
        },
        refreshSession: function() {
            this.__clearTimers();
            var that = this;
            var payload = {};
            payload.token = this.get('refreshToken');
            if (!Utility.isProductionEnv()) {
                console.time("REFRESH TOKEN API CALL");
            }
            io.POST('/refresh', payload, function(data, status, xhr) {
                console.timeEnd("REFRESH TOKEN API CALL");
                console.log('>>> Successful Token Refresh Responce <<<');
                that.__setupHandlers(data);
            }, function(xhr, status, error) {
                console.timeEnd("REFRESH TOKEN API CALL");
                console.log('>>> Bad Token Refresh Responce <<<');
            });
        },
        startCoundown: function() {
            this.__countdown();
            this.sessionTimers.displayCountdownIntervalId = setInterval(this.__countdown, 1000);
        },
        onSignupSuccess: function() {
            var payload = this.User.getUserLogin();
            this.login(payload);
        },
        __setupHandlers: function(data) {
            this.setTokens(data);

            this.initializeSession(data);

            io.storeHeaders({"Authorization":"token.v1 " + data.token});
        },
        __clearTimers: function() {
            clearInterval(this.sessionTimers.promptToExtendSessionTimeoutId);
            clearInterval(this.sessionTimers.displayCountdownIntervalId);
            this.sessionTimers.promptToExtendSessionTimeoutId = null;
            this.sessionTimers.displayCountdownIntervalId = null;
            this.set('notifyUser', false);
        },
        __startSessionManager: function() {
            var that = this;
            var sessionTimers = this.sessionTimers;
            sessionTimers.promptToExtendSessionTimeoutId = setTimeout(function() {
                that.set('notifyUser', true);
            }, this.get('secondsBeforePrompt') * 1000);
        },
        __countdown: function() {
            var countDownSeconds = this.__getCountdownSeconds();
            var cd = new Date(countDownSeconds * 1000);
            var minutes = cd.getUTCMinutes(),
                seconds = cd.getUTCSeconds(),
                minutesDisplay = minutes === 1 ? '1 minute ' : minutes === 0 ? '' : minutes + ' minutes ',
                secondsDisplay = seconds === 1 ? '1 second' : seconds + ' seconds',
                countDownDisplay = minutesDisplay + secondsDisplay;

            this.set('countDownDisplay', countDownDisplay);
            if (countDownSeconds === 0)
                this.onUnauthorized();
            countDownSeconds = countDownSeconds - 1;
            this.set('countDownSeconds', countDownSeconds);
        },
        __getCountdownSeconds: function() {
            var cdSecs = this.get('countDownSeconds');
            if (cdSecs == undefined)
                cdSecs = this.defaults.countDownSeconds;
            return cdSecs;
        }
    });
    return new sessionModel();
});