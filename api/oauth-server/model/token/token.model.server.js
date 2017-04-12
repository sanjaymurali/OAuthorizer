/**
 * Created by sanjaymurali on 3/17/17.
 */

module.exports = function () {

    var api = {
        findTokenByAuthCode: findTokenByAuthCode,
        createToken: createToken
        /*createComment: createComment,
        insertCommentForUser: insertCommentForUser,
        findCommentByUserId: findCommentByUserId,
        findCommentByCommentorId: findCommentByCommentorId,
        updateComment: updateComment,
        deleteComment: deleteComment
        /*findCommentById: findCommentById*/
    };

    var mongoose = require('mongoose');


    var q = require('q');
    mongoose.Promise = global.Promise;

    var TokenSchema = require('./token.schema.server.js')();
    var TokenModel = mongoose.model('TokenModel', TokenSchema);

    return api;

    function findTokenByAuthCode(authCode) {
        var deferred = q.defer();
        TokenModel.findOne({'authCode': authCode}, function(err, token) {
            if(err)
                deferred.reject(err)
            else
                deferred.resolve(token);
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