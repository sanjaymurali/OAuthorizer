/**
 * Created by sanjaymurali on 2/9/17.
 */

(function () {
    angular
        .module("MainApp")
        .controller("loginController", loginController);

    function loginController(UserService, $state, $window) {
        var vm = this;

        function init() {
            $window.document.title = "Login"; //Way to set the title of a page
            vm.user = {};
            vm.login = login;
        }

        init();


        function login(user) {
            var loginUser = {};
            UserService
                .findUserByCredentials(user.username, user.password)
                .then(function (response) {
                    if (!response.data.user) {
                        vm.error = 'User not found';
                    }
                    else {
                        var json = response.data;
                        loginUser = json.user;
                        $state.go('profile', {uid: loginUser._id});
                    }
                }, function (error) {
                    vm.error = 'User not found';
                });
        }
    }
})();