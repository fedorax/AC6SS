'use strict';

// Load the module dependencies
const path = require('path');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require(path.resolve('server/middleware/config/config'));
const logger = require(path.resolve('server/middleware/logging/logger')).getLogger('system');
const db = require(path.resolve('server/middleware/database/sequelize'));

// Create the Local strategy configuration method
module.exports = function (passport) {
    // Use Passport's 'serializeUser' method to serialize the user id
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    // Use Passport's 'deserializeUser' method to load the user document
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    // Use the Passport's Local strategy
    passport.use('jwt', new JwtStrategy({
        secretOrKey: config.jwt.secretKey,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, function (jwt_payload, done) {
        if (!jwt_payload) {
            return done({'message': 'No auth token'});
        }
        // Use the 'User' model 'findOne' method to find a user with the current userid.
        logger.debug('jwt_payload:' + JSON.stringify(jwt_payload));
        db
            .User
            .findById(jwt_payload.id)
            .then((result) => {
                if (!result) {
                    return done({'message': 'Invalid token.'});
                }
                // Otherwise, continue to the next middleware with the user object
                return done(null, result);
            })
            .catch((err) => {
                return done(err);
            });
    }));
};