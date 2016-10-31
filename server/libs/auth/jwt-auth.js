var url = require("url"),
    path = require("path"),
    express = require("express"),
    _ = require("underscore"),
    jwt = require("jwt-simple"),
    Utility = require("../utils"),
    Accounts = require("../../models/public/accounts"),
    app = express();

var appConfig = global.settings, apiBasePath = null;

function matchingPathSpec(path) {
    for (var p in appConfig.authorization.pathSpec) {
        if (path.indexOf(p) >= 0)
            return p;
    }
    return 'global';
}

function isPublicPath(path) {
    var p = 0;
    var pathSpec = matchingPathSpec(path);
    var pathAuth = appConfig.authorization.pathSpec[pathSpec];
    if (pathSpec !== 'global') {
        path = Utility.removeTrailingSlashes(path.replace(pathSpec, ''));
    }

    if (pathAuth.protect && pathAuth.protect.length) {
        for (p = 0; p < pathAuth.protect.length; p++) {
            if (path.indexOf(pathAuth.protect[p]) === 0)
                return false;
        }
    }

    if (pathAuth.public && pathAuth.public.length) {
        for (p = 0; p < pathAuth.public.length; p++) {
            if (path.indexOf(pathAuth.public[p]) === 0)
                return true;
        }
    }
    return false;
}

function rejectProtectedRequests(req, res, next, responseObj) {
    if (isPublicPath(req.path))
        return next();

    res.status(responseObj.status);
    if (!responseObj.empty) {
        var body = {
            statusCode: responseObj.status,
            code: responseObj.status + '',
            message: responseObj.errMsg
        };
        if (responseObj.json) {
            body = _.extend(body, responseObj.json);
        }
        res.json(body);
    }
    res.end();
    return next(responseObj.errMsg);
}

module.exports = function(req, res, next) {
    if (!appConfig) {
        appConfig = req.appSettings;
    }
    if (!apiBasePath) {
        apiBasePath = Utility.removeTrailingSlashes(appConfig.apiPath);
    }

    var parsedUrl = url.parse(req.url, true),
        errMsg = '',
        // Express makes all req.headers lowercase
        token = req.headers["authorization"],
        // TODO: implement a strategy pattern with strategy/version
        tokenVer = 'v1'; // default version if not found

    if (token) {
        if (token.indexOf("token.") === 0) {
            token = token.replace("token.", "").split(" ");
            tokenVer = token.length > 1 ? token[0] : tokenVer;
            token = token.length > 1 ? token[1] : token[0];
        } else {
            token = "";
        }
    }

    // original tokenization
    token = token || (req.body && req.body.access_token) || parsedUrl.query.access_token || req.headers["x-access-token"];
    req.token = {
        t: token || '',
        v: tokenVer
    };

    if (token) {
        try {
            Accounts.validateAccessToken(token, appConfigs).then(function(decoded) {
                Accounts.get({id: decoded.iss}).then(function(account) {
                    req.account = account;
                    return next();
                }).fail(function(err) {
                    rejectProtectedRequests(req, res, next, {
                        status: 401,
                        errMsg: err || ('No Accounts found for authorization token.' + tokenVer),
                        empty: true
                    });
                }).done();
            }).fail(function(err) {
                switch (err) {
                    case 'EXPIRED':
                        errMsg = 'Expired Token';
                        break;
                    case 'REFRESH':
                        errMsg = 'Refresh Token';
                        break;
                    default:
                        errMsg = 'Invalid Token';
                        break;
                }
                return rejectProtectedRequests(req, res, next, {
                    status: 401,
                    errMsg: errMsg
                });
            }).done();
        } catch (err) {
            return rejectProtectedRequests(req, res, next, {
                status: 500,
                errMsg: "Oops something went wrong",
                json: {
                    devMessage: err
                }
            });
        }
    } else {
        return rejectProtectedRequests(req, res, next, {
            status: 401,
            errMsg: "Not Authenticated"
        });
    }
};