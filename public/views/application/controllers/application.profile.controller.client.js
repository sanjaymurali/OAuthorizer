(function () {
    angular
        .module("MainApp")
        .controller("appProfileController", appProfileController);

    function appProfileController($state, $stateParams, UserService, CommentService, helperService) {
        var vm = this;

        function init() {
            vm.userId = $stateParams['appid'];
            vm.currentUser = UserService.getUser();

            // Initial Form and other HTML elements settings
            vm.currentSelectedRating = 0;
            vm.firstToComment = false; //No Comments at all
            vm.userCantComment = false; //User has commented and its visible
            vm.editingComment = false; //User chose to edit his/her comment
            vm.showThankYou = false; //To show Thank you message or not

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
                if(vm.user.userType === "normalUser")
                    $state.go('profile', {uid: vm.userId});
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
                    vm.userCantComment = checkIfUserCanComment(vm.currentUser._id, vm.comments.comments);
                }
                showThankYouMessage();
            }, function (err) {
                $state.go('sessionerror');
            });
        }

        init();

        function postComment(comment) {
            cleanUpAlerts();

            if (!comment || !comment.title || !comment.review){
                // To make sure that the form cannot be submitted.
            }
            else{
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
                    vm.postCommentForm.$submitted = false;
                    if(response.data.loggedin !== undefined)
                        $state.go('sessionerror');
                    else{
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
                            vm.userCantComment = true;
                            vm.successMessage = response.data.message;
                            vm.newComment = null;
                            vm.initialRating = "0";

                            showThankYouMessage();
                        }
                    }
                }, function(err) {
                    vm.postCommentForm.$submitted = false;
                    vm.error = true;
                    vm.errorMessage = response.data.message;
                    vm.initialRating = "0";
                });
            }

        }

        function editComment(commentToBeEdited, index) {
            /*
            For adding the comment back dynamically after the update is
            successful.
             */
            commentToBeEdited.index = index;

            if(commentToBeEdited !== vm.commentChosenForEditing)
                angular.copy(commentToBeEdited, vm.commentChosenForEditing);

            vm.editingComment = true;
            vm.userCantComment = false;
            showThankYouMessage();
        }

        function updateComment(userid, updatedComment) {
            cleanUpAlerts();

            var payload = {
                userid: userid,
                comments: []
            };
            updatedComment.rating = vm.currentSelectedRating;
            payload.comments.push(updatedComment);

            CommentService.updateComment(payload).then(function(response){
                vm.editCommentForm.$submitted = false;
                if(response.data.loggedin)
                    $state.go('sessionerror');
                else {
                    vm.success = true;
                    vm.successMessage = "Successfully Updated!";
                    vm.comments.comments.splice(updatedComment.index,1,payload.comments[0]);
                }
            }, function(err){
                vm.editCommentForm.$submitted = false;
                vm.error = true;
                vm.errorMessage = "Sorry, Wasn't able to update your review!";
            });


        }

        function deleteComment(userid, postedid, index) {
            cleanUpAlerts();
            CommentService.deleteComment(userid, postedid).then(function(response){
                vm.success = true;
                vm.successMessage = "Successfully Deleted!";
                vm.comments.comments.splice(index,1);
                console.log(vm.comments.comments)
                if(!vm.comments.comments || vm.comments.comments.length === 0){
                    vm.firstToComment = true;
                }
                vm.editingComment = false;
                vm.userCantComment = false;
                showThankYouMessage();

            }, function(err){
                vm.error = true;
                vm.errorMessage = "Sorry, Your comment couldnt be deleted!";
            });
        }

        function ratingChange($event) {
            vm.currentSelectedRating = $event.rating;
        }

        function checkIfUserCanComment(commentorid, comments) {
            for(var i=0; i < comments.length; i++){
                if(comments[i].postedid === commentorid) {
                    return true
                    break;
                }
            }

            return false;
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

        function showThankYouMessage() {

            if(vm.userCantComment === true)
                vm.showThankYou = true;
            else if(vm.editingComment === true)
                vm.showThankYou = false;
            else if(vm.firstToComment === true)
                vm.showThankYou = false;
            else{}

        }


    }
})();