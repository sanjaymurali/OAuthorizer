/**
 * Created by sanjaymurali on 3/17/17.
 */

module.exports = function () {

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

    function findUserByAccessToken(accessToken) {
        var deferred = q.defer();
        TokenModel.findOne({'accessToken': accessToken}, function(err, user) {
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(user);
        });

        return deferred.promise;
    }

    function createToken(token) {

        var deferred = q.defer();
        TokenModel.create(token, function (err, token) {
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(token)
        });

        return deferred.promise;
    }

};