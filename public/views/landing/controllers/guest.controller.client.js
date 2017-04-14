/**
 * Created by sanjaymurali on 4/13/17.
 */

/**
 * Created by sanjaymurali on 2/9/17.
 */

(function () {
    angular
        .module("MainApp")
        .controller("guestController", guestController);

    function guestController(UserService, $state, $window, guestLogin) {
        var vm = this;

        function init() {
            $window.document.title = "OAuthorizer"; //Way to set the title of a page

            vm.user = guestLogin;


            if(!vm.user)
                vm.guestConfirm = true;
            else
                vm.guestConfirm = false;


        }

        init();

    }
})();