'use strict';
// Load the module dependencies
const fs = require('fs');
const path = require('path');
const passport = require('passport');

// Define the Passport configuration method
module.exports = () => {

    // Load Passport's strategies configuration files
    fs
        .readdirSync(path.resolve('server/middleware/passport/strategies/'))
        .filter((filename) => {
            return filename.endsWith('.js');
        })
        .forEach((filename) => {
            require(path.resolve('server/middleware/passport/strategies/' + filename))(passport);
        });
};