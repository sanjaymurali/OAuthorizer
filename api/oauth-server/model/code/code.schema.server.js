/**
 * Created by sanjaymurali on 3/17/17.
 */

module.exports = function () {
    var mongoose = require('mongoose');

    var options = {collection: 'codes', timestamps: {createdAt: 'dateCreated', default: Date.now}};

    var CodeSchema = mongoose.Schema({
        authCode: String,
        redirectUri: String,
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
        clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'}
    }, options);

    return CodeSchema;
};