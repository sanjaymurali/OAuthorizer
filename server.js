var express = require('express');

var app = express();

require('./server.config')(app);
require("./api/app.js")(app);

/* Angular 1.5 */

app.use(express.static(__dirname + '/public'));

//Used to setup the client
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/views', express.static(__dirname + '/public/views'));

app.all('/!*', function (req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', {root: 'public'});
});

/* Angular 2+ */

/*app.use(express.static(__dirname + '/dist'));

//Used to setup the client
app.use('/js', express.static(__dirname + '/dist/js'));
app.use('/css', express.static(__dirname + '/dist/css'));
app.use('/views', express.static(__dirname + '/dist/views'));

app.all('/*', function (req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', {root: 'dist'});
});
*/

var port = process.env.PORT || 3000;

app.listen(port);
