'use strict';
const jwt = require('jsonwebtoken');
const path = require('path');
const passport = require('passport');
const config = require(path.resolve('server/middleware/config/config'));
const logger = require(path.resolve('server/middleware/logging/logger')).getLogger('system');

// user signup
exports.signup = function (req, res, next) {
    logger.debug('[controller]auth.controller();');

    if (!req.body) {
        return res
            .status('400')
            .send({'message': 'request parameter is empty.'});
    }

    passport.authenticate('local-signup', (err, user, result) => {
        if (err || !user) {
            return faildLogin(req, res, err || result);
        }
        return successLogin(req, res, user);
    })(req, res, next);
};

// user login
exports.login = function (req, res, next) {
    // login by token
    if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')) {
        return loginJwt(req, res, next);
    }
    // login by post
    return loginPost(req, res, next);
};

// user logout
exports.logout = function (req, res, next) {
    logger.debug('[controller]auth.controller();');

    req
        .session
        .destroy();
    res.set("Set-Cookie", ['login=false', 'user=none']);
    res.redirect('/');
};

function loginJwt(req, res, next) {
    passport.authenticate('jwt', (err, user, result) => {
        if (err || !user) {
            return faildLogin(req, res, err || result);
        }
        return successLogin(req, res, user);
    })(req, res, next);
}

function loginPost(req, res, next) {
    if (!req.body) {
        return res
            .status('400')
            .send({'message': 'request parameter is empty.'});
    }
    passport.authenticate('local-login', (err, user, result) => {
        if (err || !user) {
            return faildLogin(req, res, err || result);
        }
        return successLogin(req, res, user);
    })(req, res, next);
}

function faildLogin(req, res, err) {
    console.dir(err);
    logger.error('[controller][auth][authenticate]' + err);
    req.flash('error', err);
    return res
        .status(401)
        .send(err);
}

function successLogin(req, res, userInfo) {
    res.set("Set-Cookie", ['login=true']);
    req.session.login = true;
    req.session.user = userInfo;
    let token = generateJWT(userInfo);
    return res.json({token: token, user: userInfo});
}

// generate user session cookie
function generateJWT(userInfo) {
    return jwt.sign({
        userId: userInfo.USER_ID,
        firstName: userInfo.FIRST_NAME,
        lastName: userInfo.LAST_NAME,
        email: userInfo.email
    }, config.jwt.secretKey, {expiresIn: config.jwt.expire});
}