/**
 * Created by sanjaymurali on 3/17/17.
 */

module.exports = function () {
    var mongoose = require('mongoose');

    var options = {collection: 'comments', timestamps: {createdAt: 'dateCreated', default: Date.now}};

    var commentSubDocSchema = mongoose.Schema({
        postedid: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
        postedby: String,
        title: String,
        review: String,
        rating: Number
    }, options);

    var CommentSchema = mongoose.Schema({
        userid: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
        comments: [commentSubDocSchema]
    }, options);

    return CommentSchema;
};