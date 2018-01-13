/***
 * The schema for the "tokens" table
 */
module.exports = function () {
    var mongoose = require('mongoose');

	// setups the collection name and the timestamp for each entry in the collection
    var options = {collection: 'tokens', timestamps: {createdAt: 'dateCreated', default: Date.now}};

	/*
		The tokens collections contains the following:
			1. accessToken -> Token for a particular user
			3. userId -> the user ID of the user who has given access to their profile to a particular client
			4. clientId -> the client ID of the client which has requested access for an user's profile
	 */
    var TokenSchema = mongoose.Schema({
        accessToken: String,
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
        clientId: String
    }, options);

    return TokenSchema;
};