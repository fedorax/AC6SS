'use strict';
// Load the module dependencies
const path = require('path'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport');

const config = require(path.resolve('server/middleware/config/config'));
require(path.resolve('server/middleware/database/sequelize'));

// Define the Express configuration method
module.exports = function () {
    // Create a new Express application instance
    const app = express();

    // Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress'
    // middleware
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    // Use the 'body-parser' and 'method-override' middleware functions
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Configure the 'session' middleware
    app.use(session({saveUninitialized: true, resave: true, secret: config.sessionSecret}));

    // Point static path to dist
    app.use(express.static(path.join(__dirname, '/../../dist/client')));

    // Set the application view engine and 'views' folder
    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    // Configure the flash messages middleware
    app.use(flash());

    // Configure the Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());
    //Configure static file serving
    app.use('/', express.static(path.resolve('./public')));
    app.use('/lib', express.static(path.resolve('./node_modules')));

    // Configure the route
    require(path.resolve('server/middleware/router/router'))(app);

    // Return the Express application instance
    return app;
};