(function () {
    angular
        .module("MainApp")
        .controller("allAppsController", allAppsController);

    function allAppsController($state, UserService) {
        var vm = this;

        function init() {

            vm.noAppsToShow = false;

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