/**
 * Created by sanjaymurali on 2/13/17.
 */

(function () {
    var MainAppModule = angular.module('MainApp');


    MainAppModule.directive('navFooterCommon', commonfooter);

    function commonfooter() {
        return {
            scope: scope,
            link: linkfn,
            templateUrl: 'directives/templates/nav.footer.common.client.html'
        }
    }

    var scope = {
        userid: '@uid'
    };

    function linkfn(scope, element) {
        scope.userid = element.attr('uid');
    };

})();