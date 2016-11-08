var Q = require("q"),
    path = require("path"),
    express = require("express"),
    passport = require("passport"),
    LocalStrategy = require('passport-local').Strategy,
    Accounts = require("../../models/public/accounts"),
    app = express();

module.exports = function(passport) {
    /**
     * passport session setup
     * required for persistent login sessions
     * passport needs ability to serialize and unserialize users out of session
     */

    /** used to serialize the user for the session */
    passport.serializeUser(function(account, done) {
        done(null, account.id);
    });

    /** used to deserialize the user */
    passport.deserializeUser(function(id, done) {
        Accounts.get({id: id}).then(function(account) {
            done(null, account);
        }).fail(function(err) {
            done(err, null);
        });
    });

    /**
     * LOCAL SIGNUP
     * we are using named strategies since we have one for login and one for signup
     * by default, if there was no name, it would just be called 'local'
     */
    passport.use('local-signup', new LocalStrategy({
        /** by default, local strategy uses username and password, we will override with email */
        usernameField: "email",
        passwordField: 'password',
        /** allows us to pass back the entire request to the callback */
        passReqToCallback: true
    }, function (req, email, password, done) {
        /** asynchronous
         * User.findOne wont fire unless data is sent back
         */
        process.nextTick(function(callback) {
            /**
             * find a user whose email is the same as the forms email
             * we are checking to see if the user trying to login already exists
             */
            Accounts.get({email: email}).then(function(account) {
                if (account.length) {
                    return done(null, false);
                } else {
                    /** there is no user with that email */
                    Accounts.saveDoc(req).then(function(response) {
                        return done(null, response);
                    }).fail(function(err) {
                        return done(err, null);
                    }).done();
                }
                return done(null, account);
            }).fail(function(err) {
                return done(err, null);
            }).done();
        });
    }));

    passport.use('local-login', new LocalStrategy({
        /** by default, local strategy uses username and password, we will override with email */
        usernameField: "email",
        passwordField: 'password',
        /** allows us to pass back the entire request to the callback */
        passReqToCallback: true
    }, function(req, email, password, done) {
        Accounts.get({email: email, password: password}).then(function(account) {
            if (!account.length) {
                /** if no user is found, return the message */
                return done(null, false, {message: 'Credentials Do Not Exists.'});
            }
            /** if the user is found but the password is wrong */
            if (req.body.password !== account.password) {
                return done(null, false, {message: 'Incorrect Credentials.'});
            } else {
                /** all is well, return successful user */
                return done(null, account);
            }
        }).fail(function(err) {
            return done(err);
        }).done();
    }));
};