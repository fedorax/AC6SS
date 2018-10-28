'use strict';

const fs = require('fs');
const path = require('path');
// Define the routes module' method
module.exports = (app) => {
    require(path.resolve('server/middleware/auth/auth.route'))(app);
    // Load the routing files
    fs
        .readdirSync(path.resolve('server/app/route'))
        .filter((filename) => {
            return filename.endsWith('.route.js');
        })
        .forEach((filename) => {
            require(path.resolve('server/app/route/' + filename))(app);
        });
};