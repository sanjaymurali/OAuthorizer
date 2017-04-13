/**
 * Created by sanjaymurali on 4/12/17.
 */


(function () {
    angular
        .module("MainApp")
        .controller("authController", authController);

    function authController($state, $stateParams, UserService, AuthService) {
        var vm = this;

        function init() {
            vm.clientId = $stateParams['client_id'] + "";
            vm.redirectUri = $stateParams['redirect_uri'] + "";

            if(!vm.clientId || !vm.redirectUri)
                $state.go('authproblem');

            vm.currentUser = UserService.getUser();
            vm.showLogin = true;
            console.log(vm.currentUser)


            console.log(vm.clientId, vm.redirectUri);

            vm.login = login;
            vm.deny = deny;

            if(!vm.showLogin) {
                AuthService.getAuthorization(vm.clientId, vm.redirectUri).then(function(response){
                    var data = response.data;
                    console.log(data)
                    vm.transactionID = data.transactionID;
                    vm.clientname = data.client.appname;
                }, function(err){
                    $state.go('authproblem');
                });
            }

        }

        init();

        function login(user) {
            var loginUser = {};
            if (!user.username || !user.password) {
            }
            else {
                UserService
                    .login(user)
                    .then(function (response) {
                        if (!response.data.user) {
                            vm.error = 'User not found';
                        }
                        else {
                            vm.currentUser = response.data.user;
                            AuthService.getAuthorization(vm.clientId, vm.redirectUri).then(function(response){
                                var data = response.data;
                                vm.transactionID = data.transactionID;
                                vm.clientname = data.client.appname;
                            }, function(err){
                                $state.go('authproblem');
                            });
                            vm.showLogin = false;
                            console.log(vm.currentUser)
                        }
                    }, function (error) {
                        vm.error = 'User not found';
                    });
            }

        }

        function deny() {

                $state.go('login');
        }

    }
})();