'use strict';
const path = require('path');
const log4js = require('log4js');
const log4js_config= require(path.resolve('server/config/log4js.json'));
log4js.configure(log4js_config);

module.exports = log4js;