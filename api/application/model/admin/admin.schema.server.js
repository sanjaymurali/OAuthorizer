/**
 * Created by sanjaymurali on 3/17/17.
 */

module.exports = function () {
    var mongoose = require('mongoose');

    var options = {collection: 'users', discriminatorKey: 'userType', timestamps: {createdAt: 'dateCreated'}};

    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        userType: {type: String, default: admin},
        profileimage: String
    }, options);

    return UserSchema;
};