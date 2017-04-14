/**
 * Created by sanjaymurali on 2/17/17.
 */

module.exports = function (app, commentModel) {

    app.post('/api/comment',checkSessionMiddleware, createComment);
    app.put('/api/comment',checkSessionMiddleware, updateComment);
    app.delete('/api/comment/:userid/:postedid', deleteComment);
    app.get('/api/comment/:userid', findCommentByUserId);

    function createComment(req, res) {
        var comment = req.body;

        comment = checkForId(comment);

        if(req.user && req.user.userType === "appOwner")
            res.json({success: false, message: "You cant review an App!"});

        else {
            commentModel.findCommentByUserId(comment.userid).then(function(response){
                if(!response){ //Create a new comment for that app
                    commentModel.createComment(comment).then(function(response){
                        res.json({success: true, message: "Comment Created!"});
                    }, function(err){
                        res.json({success: false, message: "Comment Couldnt be Created!"});
                    });
                }
                else{ //insert a comment for that userid.
                    //if a comment by an user for the app already exists, dont allow.
                    commentModel.findCommentByCommentorId(response.userid, comment.comments[0].postedid).then(function(commentbyuser){
                        if(!commentbyuser){
                            commentModel.insertCommentForUser(response.userid, comment.comments[0]).then(function(response){
                                res.json({success: true, message: "Comment Inserted"});
                            }, function(err){
                                res.json({success: false, message: "Comment Couldnt be Inserted!"});
                            })
                        }
                        else{
                            res.json({success: false, message: "User can comment only once"});
                        }
                    }, function(err){
                        res.json({success: false, message: "Comment Couldnt be Inserted!!"});
                    })
                }

            }, function(err){
                res.json({success: false, message: "A DB Error Occurred"});
            })
        }

    }

    function updateComment(req, res) {
        var updatedComment = req.body;

        var userid = updatedComment.userid + "";
        var modifiedComment = updatedComment.comments[0];

        commentModel.updateComment(userid, modifiedComment).then(function(comment){
            if(!comment)
                res.sendStatus(404);
            else{
                res.sendStatus(200);
            }
        }, function (err){
            res.sendStatus(500);
        });

    }

    function deleteComment(req, res) {
        var useridfromclient = req.params.userid + "";
        var postedid = req.params.postedid + "";

        var userid = !req.user? "" : (req.user._id + "");
        if(req.isAuthenticated() && (postedid === userid)) {
            commentModel.deleteComment(useridfromclient, postedid).then(function(response){
                res.sendStatus(200);
            }, function(err){
                res.sendStatus(500);
            })
        }
        else {
            res.status(200).json({success: false});
        }

    }

    function findCommentByUserId(req, res) {
        var userid = req.params.userid + "";
        commentModel.findCommentByUserId(userid).then(function(response){
            res.status(200).json({comments:response});
        }, function(err){
            res.sendStatus(500);
        })
    }


    function checkSessionMiddleware(req, res, next) {
        var postedid = req.body.comments[0].postedid + "";
        var userid = !req.user? "" : req.user._id + "";
        if(req.isAuthenticated() && postedid === userid)
            next();
        else
            return res.json({loggedin: false});
    }

    function checkForId(comment) {
        if(comment._id)
            delete comment._id;
        if(comment.comments[0]._id)
            delete comment.comments[0]._id;

        return comment;
    }
 };