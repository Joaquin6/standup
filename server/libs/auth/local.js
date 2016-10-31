var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var init = require('./passport');
var Accounts = require("../../models/public/accounts");

var options = {};

passport.use(new LocalStrategy(options, function(email, password, done) {
    // check to see if the email exists
    Accounts.get({email: email, password: password}).then(function(account) {
        if (!account) {
            return done(null, false);
        }
        if (password !== account.password) {
            return done(null, false);
        } else {
            return done(null, account);
        }
    }).catch(function(err) {
        return done(err);
    });
}));

module.exports = passport;