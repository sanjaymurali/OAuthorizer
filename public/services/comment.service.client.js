/**
 * Created by sanjaymurali on 2/9/17.
 */

(function () {
    angular
        .module("MainApp")
        .factory('CommentService', commentService);

    function commentService($http) {

        var apiURL = '/api/';

        var api = {
            "createComment": createComment,
            "updateComment": updateComment,
            "deleteComment": deleteComment,
            "findCommentByUserId": findCommentByUserId
        };
        return api;



        function createComment(comment) {
            return $http.post(apiURL + 'comment', comment);
        }

        function findCommentByUserId(userid) {
            return $http.get(apiURL + 'comment/' + userid);
        }

        function updateComment(updatedComment) {
            return $http.put(apiURL+'comment/', updatedComment);
        }

        function deleteComment(userid, postedid) {
            return $http.delete(apiURL + 'comment/' + userid + "/" + postedid);
        }


    }
})();