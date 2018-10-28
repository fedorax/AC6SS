'use strict';
let path = require('path');
// Load the correct configuration file according to the 'NODE_ENV' variable
module.exports = require(path.resolve('server/config/env/' + process.env.NODE_ENV + '.js'));