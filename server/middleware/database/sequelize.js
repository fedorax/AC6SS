'use strict';

const Sequelize = require('sequelize');

const path = require('path');
const config = require(path.resolve('server/middleware/config/config'));

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.option);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connect to database has been established successfully.');
        require(path.resolve('server/middleware/model/model'))(sequelize).forEach((model) => {
            sequelize[model.name] = model;
        });
        return sequelize;

    })
    .then(() => {
        return sequelize.sync();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;