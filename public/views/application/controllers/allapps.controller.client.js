(function () {
    angular
        .module("MainApp")
        .controller("allAppsController", allAppsController);

    function allAppsController($state, UserService, $window) {
        var vm = this;

        function init() {
            $window.document.title = "All Apps"; //Way to set the title of a page

            vm.noAppsToShow = false;

            vm.currentUser = UserService.getUser();

            UserService
                .findUsersByType("appOwner")
                .then(function(response){
                    if(!response.data.users)
                        vm.noAppsToShow = true;
                    else {
                        vm.applications = response.data.users;
                    }
                }, function(err){
                    vm.noAppsToShow = true
                });

        }

        init();



    }
})();