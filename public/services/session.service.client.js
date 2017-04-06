/**
 * Created by sanjaymurali on 4/1/17.
 */

(function () {
    angular
        .module("MainApp")
        .factory('SessionService', sessionService);

    function sessionService($http, $q, $cookies) {

        var api = {
            "isValidSession": isValidSession,
            "isCookieValid": isCookieValid
        };
        return api;

        function isCookieValid() {
            var getCookies = $cookies.getObject('sessioninfo');
            if(getCookies === undefined || getCookies === null)
                return null;
            else if(!getCookies.success)
                return false
            else
                return true;
        }

        function isValidSession(validity) {

            var deferred = $q.defer();

            if(!validity) {

                var now = 0;
                var nowin10 = 0;

                $http.get('/api/loggedin').then(function(response) {
                    if(response.data.success){
                        now = moment.utc();
                        nowin10 = now.add(5, 's');
                        nowin10 = nowin10._d.toGMTString();

                        $cookies.putObject('sessioninfo', {success: true, user: response.data.user}, {'expires': nowin10});
                        deferred.resolve(true);
                    }

                    else{
                        now = moment.utc();
                        nowin10 = now.add(5, 's');
                        nowin10 = nowin10._d.toGMTString();
                        $cookies.putObject('sessioninfo', {success: false}, {'expires': nowin10});
                        deferred.resolve(false);
                    }

                }, function(err) {
                    now = moment.utc();
                    nowin10 = now.add(5, 's');
                    nowin10 = nowin10._d.toGMTString();
                    $cookies.putObject('sessioninfo', {success: false},{'expires': nowin10});
                    deferred.reject();
                });
            }

            else{
                deferred.resolve(true);
            }

            return deferred.promise;
        }
    }

})();
