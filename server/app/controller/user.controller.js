'use strict';
const path = require('path');
const db = require(path.resolve('server/middleware/database/sequelize.js'));

exports.getUserList = (req, res) => {
    db
        .User
        .findAll()
        .then((user) => {
            return res.send(user);
        });
};