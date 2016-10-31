'use strict';
var commonController = require('../common');

function validateLogin(req, cb) {
    var payload = {
        path    : "auth/login",
        method  : "POST",
        headers : req.headers,
        data    : req.body
    };

    commonController.InvokeHttpRequest(payload, cb);
}

module.exports = {
    ValidateLogin : validateLogin
}