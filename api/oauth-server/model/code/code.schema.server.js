/***
 * This file contains the schema for the 'codes' table
 */
module.exports = function () {
    var mongoose = require('mongoose');

    // setups the collection name and the timestamp for each entry in the collection
    var options = {collection: 'codes', timestamps: {createdAt: 'dateCreated', default: Date.now}};

    /*
        The codes collections contains the following:
            1. authCode -> Authorization Code for a particular user for a given app
            2. redirectUri -> the URL the OAuth 2.0 server needs to redirect to after the code has been successfully verified
            3. userId -> the user ID of the user who has given access to their profile to a particular client
            4. clientId -> the client ID of the client which has requested access for an user's profile
     */
    var CodeSchema = mongoose.Schema({
        authCode: String,
        redirectUri: String,
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
        clientId: String
    }, options);

    return CodeSchema;
};