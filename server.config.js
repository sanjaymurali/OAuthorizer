/***
 * Contains all the configuration required to run the server
 * @param app is the instance of express
 */
module.exports = function(app) {

    var expressSession = require('express-session');
    var cookieParser = require('cookie-parser');
    var MongoStore = require('connect-mongo')(expressSession);
    var passport = require('passport');
	var bodyParser = require('body-parser');
    var cors = require('cors');
    var connectionString = require("./api/dbconnection/connection.url")();
    var corsOptions = {
        credentials: true,
        origin: function (origin, callback) {
            callback(null, true)
        }
    };

	app.use(require('express-favicon-short-circuit'));
    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use(expressSession({
        secret: "bigsecret!",
        store: new MongoStore({
            url: connectionString
        }),
        resave: true,
        saveUninitialized: true,
        autoRemove: 'interval',
        autoRemoveInterval: 1, // In minutes. Default
        cookie: {maxAge: 600000}
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    require("./api/dbconnection/connection")(); // establish connection to the DB
};