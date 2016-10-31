define(['jquery', 'underscore', 'backbone', 'helpers/utility', 'helpers/events', 'services/io', 'collections/ParticipationCollection', 'collections/PaymentCollection'], function($, _, Backbone, Utility, Events, io, ParticipationCollection, PaymentCollection) {
    var User = Backbone.Model.extend({
        defaults: {
            "userLogin": {},
            // Temporary
            "avatar": "http://cdn3.danielacandela.com/wp-content/plugins/userpro/img/default_avatar_male.jpg",
            "phone": 'N/A',
            "isInitialized": false,
            "progressClass": {
                // Possible Values: ['complete, active, disabled']
                "appSubmitted": "disabled",
                "approved": "disabled",
                "paymentInfo": "disabled",
                "completed": "disabled"
            }
        },
        initialize: function(options) {
            if (options) {
                if (options.userType)
                    this.set('userType', options.userType);
                if (options.userType !== 'admin') {
                    this.on("change:status", this.__onStatusChange);
                    this.on("change:participationStatus", this.__onParticipationStatusChange);
                } else {
                    this.on("change:isInitialized", this.__onParticipationStatusChange);
                }
                if (options.sessionCookie && options.userCookie)
                    this.request(options);
            }
            this.listenTo(Events, Events.logout, this.logout);
        },
        request: function(options) {
            var accnt = this.get('account');
            if (!accnt) {
                if (options && options.userCookie)
                    accnt = options.userCookie;
            }
            var that = this;
            console.time("USER DATA API CALL");
            io.GET('/users/' + accnt.user, function(data, status, xhr) {
                console.timeEnd("USER DATA API CALL");
                console.log('>>> Successful User Data Responce <<<');
                console.dir(data);
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (key === "phone") {
                            var phoneObj = Utility.createPhoneObj(data[key]);
                            that.set('phoneData', phoneObj);
                            that.set(key, data[key]);
                            continue;
                        }
                        if (key === "gender") {
                            that.set("avatar", Utility.getAvatar(data[key]));
                            that.set(key, data[key]);
                            continue;
                        }
                        if (key === "paymentStatus") {
                            if (data[key].approvedPayments !== undefined)
                                data[key].approvedPayments = Utility.formatCurrency(data[key].approvedPayments);
                            if (data[key].paidPayments !== undefined)
                                data[key].paidPayments = Utility.formatCurrency(data[key].paidPayments);
                            that.set(key, data[key]);
                            continue;
                        }
                        if (key === "account") {
                            var origAccnt = that.get("account");
                            if (origAccnt)
                                _.defaults(data[key], origAccnt);
                            if (data[key].lastName)
                                data[key].lastNameInitial = Utility.getNameInitial(data[key].lastName);
                            that.set(key, data[key]);
                            continue;
                        }
                        that.set(key, data[key]);
                    }
                }
                that.set("isInitialized", true);
            }, function(xhr, status, error) {
                if (!Utility.isProductionEnv()) {
                    console.timeEnd("USER DATA API CALL");
                    console.log('Get User xhr: ' + xhr);
                    console.log('Get User status: ' + status);
                    console.log('Get User Error: ' + error);
                }
                if (error === 'Unauthorized')
                    Events.trigger(Events, Events.unauthorized, xhr);
            });
        },
        logout: function() {
            this.clear({silent:true});
            this.trigger('logout');
        },
        signup: function(payload) {
            this.defaults.userLogin["email"] = payload.email;
            this.defaults.userLogin["password"] = payload.password;
            console.dir(this.defaults);
            var collectedData = payload;
            var res = {};
            var that = this;
            console.time("CREATE ACCOUNT API CALL");
            payload.topics = [];
            io.POST('/account', payload, function(data, status, xhr) {
                console.timeEnd("CREATE ACCOUNT API CALL");
                if (data.token)
                    io.storeHeaders({"Authorization":"token.v1 " + data.token});
                res.data = data;
                res.status = status || null;
                console.dir(res);
                collectedData.account = data.account._id;
                collectedData.excludePreamble = true;
                console.dir(collectedData);
                // Second http call with token header and account id to create the actual user
                io.POST('/users', collectedData, function(data, status, xhr) {
                    console.dir(res.data);
                    res.status = status;
                    console.dir(res.data);
                    that.set('signupResponse', res);
                    data.account.id = data.id;
                    that.setAccount(data.account);
                }, function(xhr, status, error) {
                    console.dir(xhr.responseText);
                });
            }, function(xhr, status, error) {
                res.status = status;
                res.data = {};
                res.data.title = Utility.capitalizeFirstLetter(status) + ': ' + error;
                res.data.message = 'Invalid Signup';
                console.timeEnd("CREAT ACCOUNT API CALL");
                console.warn('>>> Bad User Account And Token Responce <<<');
                console.dir(res);
                that.set('signupResponse', res);
            });
        },
        setAccount: function(json) {
            if (json.lastName)
                json.lastNameInitial = Utility.getNameInitial(json.lastName);
            this.set('account', json);
            Utility.setPersistence('fsUser', json);
        },
        updateTopics: function(payload) {
            payload = this.__handleTopicsData(payload);
            var res = {};
            var that = this;
            if (!Utility.isProductionEnv())
                console.time("UPDATE TOPICS API CALL");
            console.dir(payload);
            var account = this.get('account');
            var userId = account.id;
            io.PUT('/users/' + userId + '/topics', payload, function(data, status, xhr) {
                console.timeEnd("UPDATE TOPICS API CALL");
                res.data = data;
                res.status = status || null;
                that.set('topicsResponse', res);
            }, function(xhr, status, error) {
                res.status = status;
                res.data = {};
                res.data.title = Utility.capitalizeFirstLetter(status) + ': ' + error;
                res.data.message = 'Invalid Topics';
                if (!Utility.isProductionEnv()) {
                    console.timeEnd("UPDATE TOPICS API CALL");
                    console.warn('>>> Bad User Topics Responce <<<');
                    console.dir(res);
                }
                that.set('topicsResponse', res);
            });
        },
        updateNetworks: function(payload) {
            var that = this;
            var res = {};
            res.status = 'success';
            that.set('networksResponse', res);
            if (res.status === 'success')
                this.trigger('signupSuccess');
        },
        onUserAccount: function(payload) {
            this.setAccount(payload);
            this.request();
        },
        getUserLogin: function() {
            var login = {};
            var userLogin = this.get('userLogin');
            if (!userLogin)
                userLogin = this.defaults.userLogin;
            login.email = userLogin.email;
            login.password = userLogin.password;
            this.unset('userLogin');
            return login;
        },
        isInitialized: function() {
            var init = this.get("isInitialized");
            if (init == undefined)
                init = this.defaults.isInitialized;
            return init;
        },
        __handleTopicsData: function(topics) {
            var topicsArr = [];
            for (key in topics) {
                if (topics.hasOwnProperty(key)) {
                    if (topics[key] === false)
                        continue;
                    topicsArr.push(parseInt(topics[key]));
                }
            }
            return topicsArr;
        },
        __onParticipationStatusChange: function(model, data) {
            var accnt = this.get('account');
            if (!accnt) {
                if (this.get('isInitialized') && this.get('userCookie')) {
                    accnt = this.get('userCookie');
                    this.set('account', accnt);
                }
            }
            var userId = accnt.user;
            if (!userId || !this.get('participationStatus'))
                return;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    if (data[key] > 0) {
                        ParticipationCollection.request({userId:userId});
                        PaymentCollection.request({userId:userId});
                        break;
                    }
                }
            }
            if (this.__isAdminUser(accnt))
                ParticipationCollection.request({userId:userId});
        },
        __onStatusChange: function(model, status) {
            var progressClass = this.get('progressClass');
            if (progressClass == undefined)
                progressClass = this.defaults.progressClass;
            switch(status) {
                case "submitted":
                    progressClass.appSubmitted = 'completed';
                    progressClass.approved = 'active';
                    progressClass.paymentInfo = 'disabled';
                    progressClass.completed = 'disabled';
                    break;
                case "approved":
                    progressClass.appSubmitted = 'completed';
                    progressClass.approved = 'completed';
                    progressClass.paymentInfo = 'active';
                    progressClass.completed = 'disabled';
                    break;
                case "processing":
                    progressClass.appSubmitted = 'completed';
                    progressClass.approved = 'completed';
                    progressClass.paymentInfo = 'completed';
                    progressClass.completed = 'active';
                    break;
                case "complete":
                    progressClass.appSubmitted = 'completed';
                    progressClass.approved = 'completed';
                    progressClass.paymentInfo = 'completed';
                    progressClass.completed = 'completed';
                    break;
            }
            this.set('progressClass', progressClass);
        },
        __isAdminUser: function(account) {
            if (!account)
                account = this.get('account');
            var roles = account.roles;
            if (roles.indexOf(",") > -1) {
                roles = roles.split(",");
                for (var j = 0; j < roles.length; j++) {
                    var role = roles[j];
                    if (role === "admin")
                        return true;
                }
            } else if (roles === "admin")
                return true;
            else
                return false;
        }
    });
    return User;
});