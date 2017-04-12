/**
 * Created by sanjaymurali on 3/17/17.
 */

module.exports = function () {

    var api = {
        createCode: createCode,
        deleteCode: deleteCode,
        findAuthByAuthCode: findAuthByAuthCode,
        findAuthByUserId: findAuthByUserId,
        findAuthByClientId: findAuthByClientId
    };

    var mongoose = require('mongoose');


    var q = require('q');
    mongoose.Promise = global.Promise;

    var CodeSchema = require('./code.schema.server.js')();
    var CodeModel = mongoose.model('CodeModel', CodeSchema);

    return api;

    function createCode(code) {

        var deferred = q.defer();
        CodeModel.create(code, function (err, code) {
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(code)
        });

        return deferred.promise;
    }

    function deleteCode(codeId) {

        var deferred = q.defer();
        CodeModel.remove({_id: codeId}, function (err, status) {
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(status)
        });

        return deferred.promise;
    }

    function findAuthByAuthCode(authCode) {
        var deferred = q.defer();
        CodeModel.findOne({'authCode': authCode}, function(err, code) {
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(code);
        });

        return deferred.promise;
    }

    function findAuthByUserId(userId) {
        var deferred = q.defer();
        CodeModel.findOne({'userId': userId} , function(err, code) {

            if(err)
                deferred.reject(err);
            else
                deferred.resolve(code);
        });

        return deferred.promise;
    }

    function findAuthByClientId(clientId) {
        var deferred = q.defer();
        CodeModel.findOne({'clientId': clientId} , function(err, code) {
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(code);
        });

        return deferred.promise;
    }
};