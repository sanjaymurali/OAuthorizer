/***
 * The Token model helps us perform CRUD operations on the Token table (tokens)
 */
module.exports = function () {

	// All the CRUD operations available
    var api = {
        findUserByAccessToken: findUserByAccessToken,
        createToken: createToken
    };

    var mongoose = require('mongoose');

    var q = require('q');
    mongoose.Promise = global.Promise;

    var TokenSchema = require('./token.schema.server.js')();
    var TokenModel = mongoose.model('TokenModel', TokenSchema);

    return api;

	// Functions required to perform the operations

	/***
     *
	 * @param accessToken is the token with which we need to retrieve the user's ID
	 * @returns {e|*|PromiseLike<any>|promise} which is the value of the code or error
	 */
	function findUserByAccessToken(accessToken) {
        var deferred = q.defer();
        TokenModel.findOne({'accessToken': accessToken}, function(err, user) {
			if(err) {
				var message = "There was an error Retrieving the User";
				deferred.reject(message);
			} else {
				deferred.resolve(user);
			}
        });

        return deferred.promise;
    }

	/***
     *
	 * @param token is the token with which the client can access the user's profile
	 * @returns {e|*|PromiseLike<any>|promise}
	 */
	function createToken(token) {
        var deferred = q.defer();
        TokenModel.create(token, function (err, token) {
			if(err) {
				var message = "There was an error Creating the Token";
				deferred.reject(message);
			} else {
				deferred.resolve(token);
			}
        });

        return deferred.promise;
    }

};