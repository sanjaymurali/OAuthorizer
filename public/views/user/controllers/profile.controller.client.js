(function () {
    angular
        .module("MainApp")
        .controller("profileController", profileController);

    function profileController($state, $stateParams, UserService, $window) {
        var vm = this;

        function init() {
            $window.document.title = "Profile";

            vm.userId = $stateParams['uid'] + "";
            vm.currentUser = UserService.getUser();

            vm.sameUserCantFollow = false;
            vm.followUser = false;
            vm.unFollowUser = false;

            vm.userFollowers = {};
            vm.userFollowing = {};
            vm.showingFollowers = true;
            vm.showingFollowing = false;

            if(vm.userId === (vm.currentUser._id + ""))
                vm.sameUserCantFollow = true;

            UserService.findUserById(vm.userId).then(function (response){
                vm.user = response.data.user;
                if(vm.user) {
                    if(vm.user.userType === "appOwner")
                        $state.go('app-page', {appid: vm.userId});

                    var exists = vm.user.followers.find(function(userid){
                        return (userid.userid + "") === (vm.currentUser._id + "");
                    });

                    if(!exists){
                        vm.followUser = true;
                        vm.unFollowUser = false;

                    }
                    else{
                        vm.followUser = false;
                        vm.unFollowUser = true;
                    }

                    vm.userFollowers = vm.user.followers;
                    vm.userFollowing = vm.user.following;

                }



            }, function (err) {
                $state.go('sessionerror');
            });



            vm.follow = follow;
            vm.unfollow = unfollow;
            vm.toggle = toggle;

        }

        init();

        function follow() {

            var currentUserName = vm.currentUser.username + "";

            var currentUser = {
                userid: vm.currentUser._id + "",
                username: vm.currentUser.username + ""
            };

            var followingUser = {
                userid: vm.userId + "",
                username: vm.user.username + ""
            }

            UserService
                .followUser(currentUser, followingUser)
                .then(function(response) {
                    if(response.statusText === "OK") {
                        if(!vm.user.followers){
                            vm.user.followers = []
                        }
                        vm.user.followers.push(currentUser);
                        vm.followUser = false;
                        vm.unFollowUser = true;
                    }
                }, function(err){
                    vm.followUser = true;
                    vm.unFollowUser = false;
                });
        }

        function unfollow() {
            var currentUserId = vm.currentUser._id + "";
            var followingId = vm.userId + "";
            UserService
                .unfollowUser(currentUserId, followingId)
                .then(function(response) {
                    if(response.statusText === "OK") {
                        var index = vm.user.followers.indexOf(vm.user.followers.find(function (userid) {
                            return (userid + "") === currentUserId;
                        }));

                        vm.user.followers.splice(index, 1);
                        vm.followUser = true;
                        vm.unFollowUser = false;
                    }
                }, function(err){
                    vm.followUser = false;
                    vm.unFollowUser = true;
                });
        }

        function toggle(clicked) {
            if(clicked === "followers"){
                vm.showingFollowers = true;
                vm.showingFollowing = false;
            }
            else if(clicked === "following"){
                vm.showingFollowers = false;
                vm.showingFollowing = true;
            }
            else {}
        }



    }
})();