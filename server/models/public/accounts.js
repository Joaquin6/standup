var Q = require("q"),
    _ = require("underscore"),
    jwt = require('jwt-simple'),
    Moment = require('moment'),
    Utility = require("../../libs/utils"),
    db = require("../../libs/db");

require("clarify");

function defaultTokenExpirationConfig() {
    return { duration: 15, unit: 'minutes' };
}

var defaultTokenExpiration = (function() {
    var defTokenConfig = defaultTokenExpirationConfig();
    return function () {
        return Moment().add(defTokenConfig.duration, defTokenConfig.unit).valueOf();
    }
})();

function refreshTokenTimeout(expires, mins) {
    expires = expires || defaultTokenExpiration();
    mins = (mins || 1);
    mins = mins < 0 ? 1 : mins;
    return Moment(expires).add(mins, 'minutes').valueOf();
}

function cleanProps() {
    return 'id email firstName lastName roles';
}

module.exports = {
    appSettings: null,
    get: function(params, options) {
        var deferred = Q.defer();
        params = params || {};
        options = options || {};
        var that = this;
        db.accounts.findDoc(params, options, function(err, doc) {
            if (err) {
                deferred.reject(err);
            } else {
                if (options.addMethods) {
                    if (doc[0]) {
                        doc = doc[0];
                    }
                    that.__addMethods(doc).then(function(methodDoc) {
                        deferred.resolve(methodDoc);
                    }).fail(function(err) {
                        deferred.reject(err);
                    }).done();
                } else {
                    deferred.resolve(doc);
                }
            }
        });
        return deferred.promise;
    },
    saveDoc: function(data) {
        var deferred = Q.defer();
        db.accounts.saveDoc(data, function(err, doc) {
            if (err)
                deferred.reject(err);
            else {
                deferred.resolve({
                    status: 'success',
                    doc: doc,
                    message: 'Document Saved'
                });
            }
        });
        return deferred.promise;
    },
    searchDoc: function(params, options, returnOptions) {
        var deferred = Q.defer();
        var toReturn = false;
        if (returnOptions !== undefined)
            toReturn = returnOptions;
        options = options || {};

        db.accounts.searchDoc(params, function(err, docs) {
            if (err)
                deferred.reject(err);
            else {
                if (toReturn) {
                    var resObj = _.extend({}, options);
                    resObj.docs = docs;
                    deferred.resolve(resObj);
                } else {
                    deferred.resolve(docs);
                }
            }
        });
        return deferred.promise;
    },
    update: function(data) {
        var deferred = Q.defer();
        db.accounts.save(data, function(err, doc) {
            if (err)
                deferred.reject(err);
            else {
                deferred.resolve({
                    status: 'success',
                    doc: doc,
                    message: 'Document Updated'
                });
            }
        });
        return deferred.promise;
    },
    validateAccessToken: function(token, settings, secret) {
        var deferred = Q.defer();
        this.appSettings = settings || null;
        this.__validateAccessToken(token, function(err, decoded) {
            if (err)
                deferred.reject(err);
            else
                deferred.resolve(decoded);
        });
        return deferred.promise;
    },
    __validateAccessToken: function(token, secret, cb) {
        if (!cb) {
            cb = secret;
            secret = null;
        }
        cb = Utility.ensureCallback(cb);
        if (!token) {
            return cb('No Token provided to validate');
        }
        secret = secret || this.appSettings.jwtTokenSecret;
        try {
            var decoded = jwt.decode(token, secret);
            var now = Date.now().valueOf();
            if (decoded.exp <= now) {
                // Token can be refreshed to a new token as it's within the refresh expiry
                if (now <= decoded.r)
                    return cb('REFRESH', decoded);
                return cb('EXPIRED', decoded);
            }
            cb(null, decoded);
        } catch (err) {
            return cb('INVALID', err);
        }
    },
    __addMethods: function(doc) {
        var deferred = Q.defer();
        var appSettings = this.appSettings;

        doc.cleanOutput = function () {
            return _.extend(_.pick(this, cleanProps().split(' ')), {
                user: this.account ? this.account.id || this.account : undefined
            });
        };

        doc.cleanProps = cleanProps;

        doc.isUserAccount = function(accountId) {
            if (typeof accountId === 'undefined')
                return _.isNumber(this.account) ? this.account > 0 : true;
            return this.account && (accountId === (this.account.id || this.account));
        };

        _.bindAll(doc, 'cleanOutput', 'cleanProps', 'isUserAccount');

        doc.accountId = function () {
            return !this.account ? 0 : (this.account.id || this.account || 0);
        };

        doc.accountSearch = function(reqBody) {
            var that = this;
            return Q.Promise(function(resolve, reject) {
                 if ((reqBody.firstName && reqBody.firstName.length)
                    ||  (reqBody.lastName  && reqBody.lastName.length)
                    ||  (reqBody.email  && reqBody.email.length)
                    ||  (reqBody.acctText  && reqBody.acctText.length)) {
                     // Query matching accounts
                     var acctQuery = that.find();

                     var searchByFirstName = reqBody.firstName && reqBody.firstName.length;
                     if (searchByFirstName) {
                        acctQuery.or([{firstName: reqBody.firstName}]);
                     }

                     var searchByLastName = reqBody.lastName && reqBody.lastName.length;
                     if (searchByLastName) {
                         acctQuery.or([{lastName: reqBody.lastName}]);
                     }

                     var searchByEmail = reqBody.email && reqBody.email.length;
                     if (searchByEmail) {
                         logger.debug("tried to add email");
                        acctQuery.or('email', reqBody.email);
                     }

                     var searchText = Utility.escapeRegExp(reqBody.acctText);
                     var searchByNameOrEmail = searchText && searchText.length;
                     if (searchByNameOrEmail) {
                         // IF THIS IS AN EMAIL ADDRESS MATCH EXACTLY
                         if(searchText.indexOf("@") > -1) {
                             //searchText = '"' + reqBody.acctText + '"';
                             acctQuery.or([
                                 { email: new RegExp(searchText, 'i') }
                             ]);
                         }
                         else {
                             //IF THE SEARCH TEXT IS NOT AN EMAIL MATCH EXACTLY, THEN LOOK IN THE NAME OR EMAIL
                             acctQuery.or([
                                 { lastName: new RegExp(searchText, 'i') },
                                 { firstName: new RegExp(searchText, 'i') },
                                 { email: new RegExp(searchText, 'i') }
                             ]);
                         }
                     }

                     acctQuery.distinct('account', function(err, accountIds) {
                         if(err && err !== null) {
                             resolve([]);
                         }
                         resolve(accountIds);

                     })
                 } else {
                     resolve([]);
                 }
            });
        };

        doc.generateAccessToken = function(expires, secret) {
            var isDate = expires ? new Date(expires) : null;
            if (expires && !_.isDate(isDate)) {
                secret = expires;
                expires = null;
            }
            expires = expires || defaultTokenExpiration();
            secret = secret || appSettings.jwtTokenSecret;
            var tokenFormat = {
                iss: this.id,
                u: this.email,
                exp: expires,
                r: refreshTokenTimeout(expires)
            };
            return jwt.encode(tokenFormat, secret);
        };

        _.bindAll(doc, 'accountId', 'accountSearch', 'generateAccessToken');

        doc.refreshedAccessToken = function(expiresOrConfig, secret) {
            var expires = tokenExpiration(expiresOrConfig);
            secret = secret || appSettings.jwtTokenSecret;
            var token = this.generateAccessToken(expires, secret);

            return {
                token: token,
                expires: expires
            };
        };

        doc.isInRole = function(role) {
            return (this.roles.indexOf(role) > -1);
        };

        doc.validateAccessToken = this.validateAccessToken;

        _.bindAll(doc, 'refreshedAccessToken', 'isInRole', 'validateAccessToken');


        doc.generateResetToken = function(resetPhrase, expires, secret) {
            var isDate = expires ? new Date(expires) : null;
            if (expires && !_.isDate(isDate)) {
                secret = expires;
                expires = null;
            }
            expires = expires || defaultTokenExpiration();
            secret = secret || appSettings.jwtTokenSecret;
            var tokenFormat = {
                iss: this.id,
                u: this.email,
                exp: expires,
                phrase: resetPhrase
            };
            return jwt.encode(tokenFormat, secret);
        };

        doc.validateResetToken = function(token, resetPhrase, secret, cb) {
            if (!cb) {
                cb = secret;
                secret = null;
            }
            cb = Utility.ensureCallback(cb);
            if (!token) {
                return cb('No Token provided to validate');
            }
            secret = secret || appSettings.jwtTokenSecret;
            try {
                var decoded = jwt.decode(token, secret);
                var now = Date.now().valueOf();
                if (decoded.exp <= now) {
                    return cb('EXPIRED', decoded);
                }
                if (resetPhrase !== decoded.phrase) {
                    return cb('BAD_PHRASE', false);
                }
                cb(null, decoded);
            }
            catch (err) {
                return cb('INVALID', err);
            }
        };

        _.bindAll(doc, 'generateResetToken', 'validateResetToken');

        deferred.resolve(doc);

        return deferred.promise;
    }
};