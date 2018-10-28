'use strict';
// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load the module dependencies
const path = require('path');
//const configureMongoose = require('./config/mongoose');
const config = require(path.resolve('server/middleware/config/config'));
const configureExpress = require(path.resolve('server/middleware/express/express'));

const configurePassport = require(path.resolve('server/middleware/passport/passport'));

// Create a new Mongoose connection instance const db = configureMongoose();
// Create a new Express application instance
const app = configureExpress();

// Configure the Passport middleware
const passport = configurePassport();

// Get port from environment and store in Express.
const port = config.port || process.env.PORT || '3000';
app.set('port', port);

// Listen on provided port, on all network interfaces.
app.listen(port, () => console.log(`API running on localhost:${port}`));