'use strict';
const path = require('path');

// Define the routes module' method
module.exports = function (app) {
    // Catch all other routes and return the index file
    app.get('/', (req, res) => {
        //res.sendFile(path.join(__dirname, '../../../dist/index.html'));
        res.send('hello world');
    });
};