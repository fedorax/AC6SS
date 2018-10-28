'use strict';
const path = require('path');
const logger = require('morgan');
// Set the 'development' environment configuration object
module.exports = {
    sessionSecret: 'developmentSessionSecret',
    port: 3000,
    db: {
        database: 'db',
        username: '',
        password: '',
        option: {
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            dialect: 'sqlite',
            storage: path.resolve('/db/develop.sqlite'),
            logging: logger.info
        }
    },
    jwt: {
        secretKey: 'qawsedrftgyhujikolp;@:',
        expire: 60 *24
    }
};