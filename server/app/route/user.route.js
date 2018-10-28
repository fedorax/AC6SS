'use strict';

const path = require('path');
const userController = require(path.resolve('server/app/controller/user.controller.js'));

module.exports = (app) => {
    app
        .route('/api/v1/user')
        .get(userController.getUserList);
};