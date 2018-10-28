'use strict';
// Load the module dependencies
const crypto = require('crypto');
const path = require('path');
const uuid = require('node-uuid');
const LocalStrategy = require('passport-local').Strategy;
const logger = require(path.resolve('server/middleware/logging/logger')).getLogger('system');

const db = require(path.resolve('server/middleware/database/sequelize'));
//const authModel = require(path.resolve('server/middleware/auth/auth.model'));

module.exports = (passport) => {

    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser((user, done) => {
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
                return done(err, null);
            });
    });

    // handles signup
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {
        logger.debug('[passport]local-signup();');

        const userInfo = db
            .User
            .build({
                ID: uuid.v4(),
                FIRST_NAME: req.body.firstName || "",
                LAST_NAME: req.body.lastName || "",
                EMAIL: req.body.email || null,
                PASSWORD: req.body.password || null,
                SALT: null,
                PROVIDER: 'jwt',
                PROVIDER_ID: null,
                PROVIDER_DATA: null
            });
        console.dir(userInfo);
        if (!userInfo) {
            return done({'message': 'User information is required'});
        }
        if (!userInfo.EMAIL || !userInfo.PASSWORD) {
            return done({'message': 'email or password is required'});
        }
        if (!userInfo.EMAIL.match(/.+\@.+\..+/)) {
            return done({'message': 'Please fill a valid email address'});
        }
        if (userInfo.PASSWORD.length < 6) {
            return done({'message': 'Password should be longer'});
        }

        logger.debug('[User]', userInfo);
        db
            .User
            .findAll({
                where: {
                    email: userInfo.EMAIL
                }
            })
            .then((row) => {
                if (row.length) {
                    return done({'message': 'email is already taken.'});
                }
                // generate salt.
                userInfo.SALT = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
                // build crypt password using salt by base64.
                userInfo.PASSWORD = crypto
                    .pbkdf2Sync(userInfo.PASSWORD, userInfo.SALT, 10000, 64, 'sha1')
                    .toString('hex');

                userInfo
                    .save()
                    .then((result) => {
                        return done(null, userInfo, result);
                    })
                    .catch((err) => {
                        return done(err);
                    });
            })
            .catch((err) => {
                return done(err);
            });
    }));
};