(function () {
    angular
        .module("MainApp")
        .controller("profileController", profileController);

    function profileController($state, $stateParams, UserService) {
        var vm = this;

        function init() {
            vm.userId = $stateParams['uid'];
            vm.currentUser = UserService.getUser();

            UserService.findUserById(vm.userId).then(function (response){
                vm.user = response.data.user;

                if(vm.user.userType === "appOwner")
                    $state.go('app-page', {appid: vm.userId});

            }, function (err) {
                $state.go('sessionerror');
            });


        }

        init();



    }
})();