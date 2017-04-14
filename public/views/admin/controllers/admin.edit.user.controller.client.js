(function () {
    angular
        .module("MainApp")
        .controller("adminEditUserController", adminEditUserController);

    function adminEditUserController(Upload, $state, $stateParams, AdminService, $window, UserService) {
        var vm = this;


        function init() {
            $window.document.title = "Edit User | Admin";
            var user = {};

            vm.user = UserService.getUser();
            vm.userId = $stateParams['uid'] + "";

            AdminService.findUserById(vm.userId).then(function(response){
                vm.userSelectedForEditing = response.data.user;
            }, function(err){
                vm.error = "User not Found!"
            });


            vm.update = update;
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
                        url: '/api/admin/upload/'+ vm.userId,
                        arrayKey: '',
                        data: {
                            file: Upload.dataUrltoBlob(imageFile, filename)
                        }
                    });
                }
                else if(imageFile) {
                    Upload.upload({
                        url: '/api/admin/upload/'+vm.userId,
                        arrayKey: '',
                        data: {
                            file: imageFile
                        }
                    });
                }

            AdminService
                .updateUser(vm.userId, user)
                .then(function (response) {
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


        function cleanUpAlerts() {
            vm.success = false;
            vm.error = false;
        }
    }
})();