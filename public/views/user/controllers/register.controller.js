/**
 * Created by sanjaymurali on 2/14/17.
 */

(function () {
    angular
        .module("MainApp")
        .controller("registerController", registerController);

    function registerController(UserService, $state, $window) {

        var vm = this;

        function init() {
            $window.document.title = "Register"; //Way to set the title of a page

            var currentuser = UserService.getUser();

            console.log(currentuser)
            if(currentuser)
                $state.go('profile', {uid: currentuser._id});

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
                                /*if(user.userType === "normalUser")
                                    user.userType = "";*/
                                UserService
                                    .register(user)
                                    .then(function (response) {
                                        if (response.statusText === "OK") {
                                            var json = response.data;
                                            $state.go('profile', {uid: json.user._id});
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