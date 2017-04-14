/**
 * Created by sanjaymurali on 4/14/17.
 */

(function () {
    angular
        .module("MainApp")
        .controller("searchController", searchController);

    function searchController(UserService, $state, $window) {
        var vm = this;

        function init() {
            $window.document.title = "Search"; //Way to set the title of a page
            vm.currentUser = UserService.getUser();

            cleanUpAlerts();
            vm.search = search;
        }

        init();

        function search(query) {
            cleanUpAlerts();
                UserService
                    .search(query)
                    .then(function (response) {
                        if(!response.data.owner)
                            vm.error = true;
                        else{
                            vm.error = false;
                            vm.application = response.data.owner;
                        }
                        vm.query = null;
                    }, function (error) {
                        vm.query = null;
                        vm.error = true;
                    });


        }

        function cleanUpAlerts() {
            vm.error = undefined;
        }
    }
})();