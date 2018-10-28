'use strict';
// Load the module dependencies
const crypto = require('crypto');
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const logger = require(path.resolve('server/middleware/logging/logger')).getLogger('system');

const db = require(path.resolve('server/middleware/database/sequelize'));

module.exports = function (passport) {

    // used to serialize the user for the session
    passport
        .serializeUser(function (user, done) {
            done(null, user.id);
        });

    // used to deserialize the user
    passport.deserializeUser(function (user, done) {
        db
            .User
            .findOne({
                where: {
                    email: user.email
                }
            })
            .then((result) => {
                return done(null, result);
            })
            .catch((err) => {
                return done(err);
            });
    });

    // handles login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        logger.debug('[passport]local-login()');
        db
            .User
            .findOne({
                where: {
                    EMAIL: email
                }
            })
            .then((result) => {
                if (!result) {
                    return done({'message': 'Invalid email or password.'});
                }
                console.log(crypto.pbkdf2Sync(password, result.SALT, 10000, 64, 'sha1').toString('hex'));
                // build crypt password using salt by base64.
                if (crypto.pbkdf2Sync(password, result.SALT, 10000, 64, 'sha1').toString('hex') !== result.PASSWORD) {
                    return done({'message': 'Invalid email or password.'});
                }

                // all is well, return successful user
                return done(null, result);
            })
            .catch((err) => {
                return done(err);
            });
    }));
};