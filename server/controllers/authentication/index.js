var http        = require('http'),
    Q 			= require("q"),
    express 	= require('express'),
    _ 			= require('underscore'),
    Utility  	= require('../../libs/utils'),
    Accounts 	= require('../../models/public/accounts'),
    app 		= express();

var appSettings = global.settings;

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

function isInRole(account, role) {
    return (account.roles.indexOf(role) > -1);
}

function generateAccessToken(account, expires, secret) {
    var isDate = expires ? new Date(expires) : null;
    if (expires && !_.isDate(isDate)) {
        secret = expires;
        expires = null;
    }
    expires = expires || defaultTokenExpiration();
    secret = secret || appSettings.jwtTokenSecret;
    var tokenFormat = {
        iss: account.id,
        u: account.email,
        exp: expires,
        r: refreshTokenTimeout(expires)
    };
    return jwt.encode(tokenFormat, secret);
}

function cleanProps() {
    return 'id email firstName lastName roles';
}

function cleanOutput(account) {
    return _.extend(_.pick(account, cleanProps().split(' ')), {
        user: account ? account.id || account : undefined
    });
}

module.exports = {
	appSettings: null,
	login: function(req, res, next) {
		var deferred = Q.defer();

		if (!this.appSettings) {
			this.appSettings = req.appSettings;
		}

		var appConfig = this.appSettings;

	    Accounts.get(req.body).then(function(account) {
	    	if (!account.length) {
	    		deferred.reject({
	    			statusCode: 401,
                    code: "authentication.login.invalid",
                    message: "Invalid Login"
	    		});
	    	} else {
	    		if (account[0])
	    			account = account[0];
	    		var authCfn = appConfig.authorization;
	    		var expir = isInRole(account, "service") ? authCfn.svcTokenExpiration : authCfn.tokenExpiration;
	    		var tokenExpires = Utility.tokenExpiration(expir);
	    		// Add the configured grace period to expiry of the refreshToken
                var refreshTokenExpires = Utility.refreshTokenExpiration(tokenExpires, expir);
                // Create a token for the auth process
                var token = generateAccessToken(account, tokenExpires);
                // Create a token that can only be used to get a new auth token.
                // We use the same method but different signing key
                var refreshToken = generateAccessToken(account, refreshTokenExpires, appConfig.jwtRefreshTokenSecret);

	    		deferred.resolve({
                    token: token,
                    expires: tokenExpires,
                    refreshToken: refreshToken,
                    refreshExpires: refreshTokenExpires,
                    account: cleanOutput(account)
                });
	    	}
	    }).fail(function(err) {
	    	deferred.reject(err);
	    }).done();
		return deferred.promise;
	},
    refreshToken: function(req, res, next) {
        var deferred = Q.defer();

        if (!this.appSettings) {
            this.appSettings = req.appSettings;
        }

        var appConfig = this.appSettings;

        // Is the refreshToken valid and not-expired?
        if (typeof req.body.token != 'undefined' &&
            typeof req.headers["authorization"] != 'undefined') {

            var refreshToken = req.body.token;
            var authToken = req.headers["authorization"];
            var errMsg = false;
            var tokenVer = 'v1';

            // Handle stripping the "token" string from the front
            if (authToken) {
                if (authToken.indexOf("token.") === 0) {
                    authToken = authToken.replace("token.", "").split(" ");
                    tokenVer = authToken.length > 1 ? authToken[0] : tokenVer;
                    authToken = authToken.length > 1 ? authToken[1] : authToken[0];
                } else {
                    authToken = "";
                }
            }

            Accounts.validateAccessToken(refreshToken, appConfig, appConfig.jwtRefreshTokenSecret).then(function(decodedRefresh) {
                // Call the validate method on the auth header to get the decoded value, we don't care if we get an expired error.
                Accounts.validateAccessToken(authToken, appConfig, appConfig.jwtRefreshTokenSecret).then(function(decodedAuth) {
                    // Compare key points of the two tokens, the iss an u.
                    if (decodedAuth.iss !== decodedRefresh.iss || decodedAuth.u !== decodedRefresh.u) {
                        errMsg = "Invalid Token";
                        deferred.reject({
                            statusCode: 401,
                            code: '401',
                            message: errMsg
                        });
                    } else {
                        /** We got this far so respond with a new auth and refresh token. */
                        Accounts.get({id: decodedAuth.iss}).then(function(account) {
                            /** If we found an account return valid tokens */
                            if (account[0])
                                account = account[0];
                            var authCfn = appConfig.authorization;
                            var expir = isInRole(account, "service") ? authCfn.svcTokenExpiration : authCfn.tokenExpiration;
                            var tokenExpires = Utility.tokenExpiration(expir);
                            // Add the configured grace period to expiry of the refreshToken
                            var refreshTokenExpires = Utility.refreshTokenExpiration(tokenExpires, expir);
                            // Create a token for the auth process
                            var token = generateAccessToken(account, tokenExpires);
                            // Create a token that can only be used to get a new auth token.
                            // We use the same method but different signing key
                            var refreshToken = generateAccessToken(account, refreshTokenExpires, appConfig.jwtRefreshTokenSecret);

                            deferred.resolve({
                                token: token,
                                expires: tokenExpires,
                                refreshToken: refreshToken,
                                refreshExpires: refreshTokenExpires,
                                account: cleanOutput(account)
                            });
                        }).fail(function(err) {
                            errMsg = 'Auth Failure';
                            deferred.reject({
                                statusCode: 401,
                                code: '401',
                                message: errMsg
                            });
                        }).done();
                    }
                }).fail(function(err) {
                    // Map the possible errors to a refresh token status
                    switch (err) {
                        case 'REFRESH':
                            // Do nothing on this error. It means the token is within the refresh period.
                            // The auth token either needs to be valid, or still in the refresh period to request a new token.
                            break;
                        case 'EXPIRED': // If expired, its outside the refresh window so no reason to continue.
                        case 'INVALID':
                        default:
                            errMsg = 'Invalid Token';
                            break;
                    }
                    if (errMsg) {
                        deferred.reject({
                            statusCode: 401,
                            code: '401',
                            message: errMsg
                        });
                    } else {
                        deferred.reject(err);
                    }
                }).done();
            }).fail(function(err) {
                // Map the possible errors to a refresh token status
                switch (err) {
                    case 'EXPIRED':
                    case 'REFRESH': // Can't refresh a refeshToken
                        errMsg = 'Expired Refresh Token';
                        break;
                    default:
                        errMsg = 'Invalid Refresh Token';
                        break;
                }
                if (errMsg) {
                    deferred.reject({
                        statusCode: 401,
                        code: '401',
                        message: errMsg
                    });
                } else {
                    deferred.reject(err);
                }
            }).done();
        } else {
            deferred.reject({
                statusCode: 500,
                code: '500',
                message: "Missing Token"
            });
        }
        return deferred.promise;
    }
};
