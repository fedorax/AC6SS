'use strict';
const path = require('path');
const authController = require(path.resolve('server/middleware/auth/auth.controller'));

module.exports = function (app) {
    app
        .route('/api/v1/signup')
        .post(authController.signup);
    app
        .route('/api/v1/login')
        .post(authController.login);
    app
        .route('/api/v1/logout')
        .post(authController.login);
};