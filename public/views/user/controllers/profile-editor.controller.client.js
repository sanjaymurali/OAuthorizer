(function () {
    angular
        .module("MainApp")
        .controller("profileEditController", profileEditController);

    function profileEditController(Upload, $state, $stateParams, UserService, $window) {
        var vm = this;


        function init() {
            $window.document.title = "Profile";
            var user = {};
            vm.userId = $stateParams['uid'];
            vm.user = UserService.getUser();

            vm.update = update;
            vm.unregisterUser = unregisterUser;
            vm.logout = logout;
        }

        init();

        function update(newUser, imageFile, filename) {
            cleanUpAlerts();

            var user = {};
            user = newUser;
            if(vm.appOwnerEditorForm && !vm.appOwnerEditorForm.clientId.$dirty)
                user.clientId = undefined;

                if(imageFile && filename) {

                    Upload.upload({
                        url: '/api/upload',
                        arrayKey: '',
                        data: {
                            file: Upload.dataUrltoBlob(imageFile, filename)
                        }
                    });
                }
                else if(imageFile) {
                    Upload.upload({
                        url: '/api/upload',
                        arrayKey: '',
                        data: {
                            file: imageFile
                        }
                    });
                }

            UserService
                .updateUser(vm.userId, user)
                .then(function (response) {
                    console.log(response);
                    if (response.statusText === "OK") {
                        vm.message = "User successfully updated"
                    }
                    else
                        vm.error = "Unable to update user";

                }, function(err){
                    if(err.statusText === "Conflict")
                        vm.error = "Please change ClientID";
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
            UserService.logout();
            UserService.setUser(undefined);
            $state.go('login');
        }

        function cleanUpAlerts() {
            vm.success = false;
            vm.error = false;
        }
    }
})();