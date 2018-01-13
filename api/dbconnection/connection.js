/***
 * Establish a connection to MongoDB once the server starts
 */
module.exports = function () {

    var mongoose = require("mongoose");
    var connectionString = require("./connection.url")();

    mongoose.connect(connectionString);
};