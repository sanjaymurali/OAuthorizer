(function () {
    angular
        .module("MainApp")
        .controller("profileEditController", profileEditController);

    function profileEditController(Upload, $state, $stateParams, UserService, loggedIn,$window) {
        var vm = this;


        function init() {
            $window.document.title = "Profile";
            var user = {};
            vm.userId = $stateParams['uid'];

            if(!loggedIn) {}
            else {
                vm.user = loggedIn;
            }

            vm.update = update;
            vm.unregisterUser = unregisterUser;
            vm.logout = logout;
        }

        init();

        function update(newUser, imageFile) {
            var user = {};
                if(imageFile) {
                    Upload.upload({
                        url: '/api/upload',
                        arrayKey: '',
                        data: {
                            file: imageFile
                        }
                    });
                }

            UserService
                .updateUser(vm.userId, newUser)
                .then(function (response) {
                    if (response.statusText === "OK") {
                        vm.message = "User successfully updated"
                    }
                    else
                        vm.error = "Unable to update user";
                });

        }

        function unregisterUser(user) {
            var answer = confirm("Are you sure?");
            if (answer) {
                UserService
                    .deleteUser(user._id)
                    .then(function (response) {
                        if (response.statusText === "OK")
                            $state.go('login');
                        else
                            vm.error = 'unable to remove user';
                    });
            }
        }

        function logout() {
                $state.go('login');
                UserService.logout();
        }
    }
})();