var Q = require("q"),
    path = require("path"),
    express = require("express"),
    passport = require("passport"),
    Accounts = require("../../models/public/accounts"),
    app = express();

module.exports = {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        Accounts.get({id: id}).then(function(account) {
            done(null, account);
        }).catch(function(err) {
            done(err, null);
        });
    });
};