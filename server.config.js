/**
 * Created by sanjaymurali on 11/06/17.
 */

module.exports = function(app) {

    var expressSession = require('express-session');
    var cookieParser = require('cookie-parser');
    var MongoStore = require('connect-mongo')(expressSession);
    var passport = require('passport');
    var cors = require('cors');

    app.use(require('express-favicon-short-circuit'));

    var corsOptions = {
        credentials: true,
        origin: function (origin, callback) {
            callback(null, true)
        }
    };

    app.use(cors(corsOptions));
    app.use(cookieParser());
    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    var connectionString = 'mongodb://127.0.0.1:27017/webdev-project'; //Local connectionString

    if (process.env.MLAB_USERNAME) {
        connectionString = "mongodb://"+process.env.MLAB_USERNAME + ":" +
            process.env.MLAB_PASSWORD + "@" +
            process.env.MLAB_HOST + ':' +
            process.env.MLAB_PORT + '/' +
            process.env.MLAB_APP_NAME;
    }

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

// configure a public directory to host static content

    require("./api/dbconnection/connection")(app);

};