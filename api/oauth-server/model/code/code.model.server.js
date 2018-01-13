/***
 * The Code model helps us perform CRUD operations on the Authorization Code table (codes)
 */
module.exports = function () {

    // All the CRUD operations available
    var api = {
        createCode: createCode,
        deleteCode: deleteCode,
        findAuthByClientId: findAuthByClientId
    };

    var mongoose = require('mongoose');
    var q = require('q');
    mongoose.Promise = global.Promise;

    var CodeSchema = require('./code.schema.server.js')();
    var CodeModel = mongoose.model('CodeModel', CodeSchema);

    return api;

    // Functions required to perform the operations

	/***
     *
	 * @param code is the authorization code which must be inserted into the table
	 * @returns {e|*|PromiseLike<any>|promise} which is the value of the code or error
	 */
	function createCode(code) {

        var deferred = q.defer();
        CodeModel.create(code, function (err, code) {
            if(err) {
                var message = "There was an error creating the Authorization Code";
				deferred.reject(message);
            } else {
				deferred.resolve(code)
			}
        });

        return deferred.promise;
    }

	/***
	 *
	 * @param codeId is the _id for the authorization code which must be deleted from the table
	 * @returns {e|*|PromiseLike<any>|promise} which is the status of completion
	 */
    function deleteCode(codeId) {

        var deferred = q.defer();
        CodeModel.remove({_id: codeId}, function (err, status) {
			if(err) {
				var message = "There was an error deleting the Authorization Code";
				deferred.reject(message);
			} else {
				deferred.resolve(status)
			}
        });

        return deferred.promise;
    }

	/***
	 *
	 * @param clientId is the _id of the Client trying to retrieve the authorization code
	 * @returns {e|*|PromiseLike<any>|promise} which is the authorization code or an error
	 */
    function findAuthByClientId(clientId) {
        var deferred = q.defer();
        CodeModel.findOne({'clientId': clientId} , function(err, code) {
			if(err) {
				var message = "There was an error Retrieving the Authorization Code";
				deferred.reject(message);
			} else {
				deferred.resolve(code);
			}
        });

        return deferred.promise;
    }
};