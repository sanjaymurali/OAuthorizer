/**
 * Created by sanjaymurali on 2/13/17.
 */

(function () {
    var MainAppModule = angular.module('MainApp');

    MainAppModule.directive('loginError', loginError);

    function loginError() {
        return {
            scope: scope,
            link: linkfn,
            templateUrl: 'directives/templates/login.error.common.client.html'
        }
    }

    var scope = {
        valid: '@validity'
    };

    function linkfn(scope, element, attributes) {

        var validity = scope.$eval(attributes.validity);

        console.log(typeof validity)

        if(validity === null || validity === false)
            scope.valid = false;
        else
            scope.valid = true;

    };

})();