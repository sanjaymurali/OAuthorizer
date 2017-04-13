var express = require('express');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(expressSession);
var passport = require('passport');
var app = express();

var ejs = require('ejs');

var cors = require('cors');
app.use(require('express-favicon-short-circuit'));

app.use(cors());
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

app.set('view engine', 'ejs');


// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

require("./api/dbconnection/connection")(app);

var port = process.env.PORT || 3000;

require("./api/app.js")(app);

//Used to setup the client
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/views', express.static(__dirname + '/public/views'));


app.all('/*', function (req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', {root: 'public'});
});

app.listen(port);