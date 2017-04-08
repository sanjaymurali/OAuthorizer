(function () {
    angular
        .module("MainApp")
        .controller("profileController", profileController);

    function profileController($state, $stateParams, UserService, CommentService, helperService) {
        var vm = this;

        function init() {
            vm.userId = $stateParams['uid'];
            vm.currentUser = UserService.getUser();

            // Initial Form and other HTML elements settings
            vm.currentSelectedRating = 0;
            vm.firstToComment = false;
            vm.userCantComment = false;
            vm.editingComment = false;
            vm.error = false;
            vm.success = false;
            vm.commentChosenForEditing = {};

            // Functions
            vm.ratingChange = ratingChange;
            vm.postComment = postComment;
            vm.editComment = editComment;
            vm.updateComment = updateComment;
            vm.deleteComment = deleteComment;
            vm.alertOpenClose = alertOpenClose;
            vm.checkIfUserCanEditComment = checkIfUserCanEditComment;

            UserService.findUserById(vm.userId).then(function (response){
                vm.user = response.data.user;
            }, function (err) {
                $state.go('sessionerror');
            });

            CommentService.findCommentByUserId(vm.userId).then(function (response){
                var data = response.data.comments;
                // Its a new app, and no comments exists at all
                if(!data || !data.comments || data.comments.length === 0)
                    vm.firstToComment = true;
                else {
                    vm.comments = data;
                    checkIfUserCanComment(vm.currentUser._id, vm.comments.comments);
                    console.log("User cant: ", vm.userCantComment);
                }
            }, function (err) {
                $state.go('sessionerror');
            })
        }

        init();

        function ratingChange($event) {
            vm.currentSelectedRating = $event.rating;
        }

        function postComment(comment) {
            cleanUpAlerts();
            var newComment = {};

            newComment.userid = vm.userId;

            newComment.comments = [{
                "postedid": vm.currentUser._id,
                "postedby": vm.currentUser.username,
                "title": comment.title,
                "review": comment.review,
                "rating": vm.currentSelectedRating
            }];

            CommentService.createComment(newComment).then(function(response){
                if(!response.data.success){
                    vm.error = true;
                    vm.errorMessage = response.data.message;
                    vm.initialRating = "0";
                }
                else{
                    newComment.comments[0].updatedAt = Date.now();

                    if(!vm.comments) // New App
                        vm.comments = newComment;
                    else if(!vm.comments.comments) {
                        vm.comments.comments = [];
                        vm.comments.comments.push(newComment.comments[0]);
                    }
                    else
                        vm.comments.comments.push(newComment.comments[0]);

                    vm.success = true;
                    vm.firstToComment = false;
                    vm.successMessage = response.data.message;
                    vm.newComment = null;
                    vm.initialRating = "0";
                }
            }, function(err) {
                vm.error = true;
                vm.errorMessage = response.data.message;
                vm.initialRating = "0";
            });
        }

        function editComment(commentToBeEdited, index) {
            cleanUpAlerts();
            commentToBeEdited.index = index;
            vm.editingComment = true;
            angular.copy(commentToBeEdited, vm.commentChosenForEditing);

            console.log(commentToBeEdited, index)
        }

        function updateComment(userid, updatedComment) {
            var payload = {
                userid: userid,
                comments: []
            };
            updatedComment.rating = vm.currentSelectedRating;
            payload.comments.push(updatedComment);

            CommentService.updateComment(payload).then(function(response){
                vm.success = true;
                vm.successMessage = "Successfully Updated!";
                vm.comments.comments.splice(updatedComment.index,1,payload.comments[0]);
            }, function(err){
                vm.error = true;
                vm.errorMessage = "Sorry, Wasn't able to update your review!";
            });


        }

        function deleteComment(userid, postedid, index) {
            CommentService.deleteComment(userid, postedid).then(function(response){
                vm.success = true;
                vm.successMessage = "Successfully Deleted!";
                vm.comments.comments.splice(index,1);
                if(vm.comments.comments || vm.comments.comments.length === 0)
                    vm.firstToComment = true;
            }, function(err){
                vm.error = true;
                vm.errorMessage = "Sorry, Your comment couldnt be deleted!";
            });
        }

        function checkIfUserCanComment(commentorid, comments) {
            for(var i=0; i < comments.length; i++){
                if(comments[i].postedid === commentorid) {
                    vm.userCantComment = true;
                    break;
                }
            }
        }

        function checkIfUserCanEditComment(commentorid, postedid) {
            return commentorid === postedid;
        }

        function alertOpenClose(successOrError) {
            vm.success = helperService.alertOpenClose(successOrError);
            vm.error = helperService.alertOpenClose(successOrError);
        }

        function cleanUpAlerts() {
            vm.success = false;
            vm.error = false;
        }


    }
})();