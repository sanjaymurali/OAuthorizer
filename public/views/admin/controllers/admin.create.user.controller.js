/**
 * Created by sanjaymurali on 2/14/17.
 */

(function () {
    angular
        .module("MainApp")
        .controller("adminCreateUserController", adminCreateUserController);

    function adminCreateUserController(UserService, AdminService, $state) {
        var vm = this;

        function init() {
            vm.user = {};
            vm.user.userType = "normalUser"; //Set the initial type of user
            vm.register = register;
        }

        init();

        function register(user) {
            // Remove this later
            if (!user.password || !user.verifyPassword|| !user.username){}
            else {
                if (user.password === user.verifyPassword) {
                    UserService
                        .findUserByUsername(user.username)
                        .then(function (response) {
                            if(response.data.user)
                                vm.error = 'Change the Username';
                            else {
                                AdminService
                                    .createUser(user)
                                    .then(function (response) {
                                        if (response.statusText === "OK") {
                                            vm.success = "User Created!"

                                        }
                                        else
                                            vm.error = 'Unable to register!';
                                    });
                            }
                    }, function (error) {
                            vm.error = 'Unable to register!';
                    })

                }
                else
                    vm.error = 'Passwords Do not Match!';
            }

        }

    }
})();