/**
 * Created by sanjaymurali on 2/13/17.
 */

(function () {
    var MainAppModule = angular.module('MainApp');


    MainAppModule.directive('navHeaderCommon',commonheader);

    function commonheader() {
        return {
            scope: scope,
            link: linkfn,
            controller: navHeaderController,
            controllerAs: 'model',
            templateUrl: 'directives/templates/nav.header.common.client.html'
        }
    }

    var scope = {
        guest: '@',
        appOwner: '@',
        user: '@',
        admin: '@',
        userid: '@uid'
    };

    function navHeaderController(UserService, $state) {
        var vm = this;

        function init(){
            vm.logout = logout;
        }

        init();

        function logout() {

            UserService.logout();
            UserService.setUser(null);
            $state.go('login');
        }

    }

    function linkfn(scope, element, attributes) {
        scope.userid = (attributes.uid);

        var usertype = (attributes.usertype);

        switch (usertype) {

            case 'Guest':
                scope.guest = true;
                break;

            case 'normalUser':
                scope.user = true;
                break;

            case 'appOwner':
                scope.appOwner = true;
                break;

            case 'admin':
                scope.admin = true;
                break;

            default:
                scope.guest = true;
        }
    };

})();