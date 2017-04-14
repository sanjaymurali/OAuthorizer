/**
 * Created by sanjaymurali on 3/17/17.
 */

module.exports = function () {

    var api = {
        createComment: createComment,
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

    var CommentSchema = require('./comment.schema.server.js')();
    var CommentModel = mongoose.model('CommentModel', CommentSchema);

    return api;

    function createComment(comment) {

        var deferred = q.defer();

        CommentModel.create(comment, function (err, comment) {
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(comment)
        });

        return deferred.promise;
    }

    function updateComment(userid, updatedComment) {
        var deferred = q.defer();
        var commentorid = updatedComment.postedid + "";

        findCommentByCommentorId(userid, commentorid).then(function(exsistingcomment){
            if(!exsistingcomment)
                deferred.resolve(null);
            else {
                var commentid = exsistingcomment._id;
                var commenttoupdate = {};
                commenttoupdate['comments.$.title'] = updatedComment.title;
                commenttoupdate['comments.$.rating'] = updatedComment.rating;
                commenttoupdate['comments.$.review'] = updatedComment.review;
                CommentModel.findOneAndUpdate({"userid":userid, "comments._id": commentid}, { $set: commenttoupdate, $setOnInsert: commenttoupdate}, {new: true}, function (err, comment) {
                    if(err){
                        deferred.reject(err);
                    }
                    else {
                        deferred.resolve(comment);
                    }
                });

            }
        }, function(err){
            deferred.reject(err);
        });

        return deferred.promise;
    }

    function insertCommentForUser(userid, newcomment) {

        var deferred = q.defer();

        CommentModel.findOne({userid: userid}, function (err, comment) {
            if(err)
                deferred.reject(err);
            else{
                comment.comments.push(newcomment);
                comment.save();
                deferred.resolve(comment)
            }

        });

        return deferred.promise;
    }

    function deleteComment(userid, postedid) {
        var deferred = q.defer();

        CommentModel.findOne({userid: userid}, function (err, comment) {
            if(err)
                deferred.reject(err);
            else{
                if(!comment.comments || comment.comments.length === 0)
                    deferred.reject();
                else {
                    var index = 0;
                    //index = comment.comments.indexOf(postedid);
                    for(var i=0; i < comment.comments.length; i++) {
                        if((comment.comments[i].postedid + "") === postedid) {
                            index = i;
                            break;
                        }
                    }
                    x = comment.comments.splice(index,1);
                    comment.save();
                    deferred.resolve(comment)
                }
            }

        });

        return deferred.promise;
    }

    function findCommentByUserId(userid) {
        var deferred = q.defer();

        CommentModel.findOne({userid: userid}, function (err, commentsforuser) {
            if (err)
                deferred.reject(err);
            else{
                deferred.resolve(commentsforuser);
            }

        });

        return deferred.promise;
    }

    function findCommentByCommentorId(userid, commentorid) {
        var deferred = q.defer();

        CommentModel.findOne({userid: userid, "comments.postedid": commentorid}, function (err, comment) {

            if (err)
                deferred.reject(err);
            else{
                if(!comment){
                    deferred.resolve(null);
                }
                else{
                    var count = 0;
                    var commentStore = {};
                    for(var i=0; i<comment.comments.length; i++){
                        if(count > 0)
                            break;

                        if(comment.comments[i].postedid+"" === commentorid){
                            count++;
                            commentStore = comment.comments[i];
                        }

                    }

                    if(count > 0)
                        deferred.resolve(commentStore);
                    else
                        deferred.resolve(null);
                }
            }
        });

        return deferred.promise;
    }




};