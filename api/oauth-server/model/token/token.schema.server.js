/**
 * Created by sanjaymurali on 3/17/17.
 */

module.exports = function () {
    var mongoose = require('mongoose');

    var options = {collection: 'tokens', timestamps: {createdAt: 'dateCreated', default: Date.now}};

    var TokenSchema = mongoose.Schema({
        accessToken: String,
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
        clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'}
    }, options);

    return TokenSchema;
};