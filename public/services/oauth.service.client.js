/**
 * Created by sanjaymurali on 4/12/17.
 */

(function () {
    angular
        .module("MainApp")
        .factory('AuthService', AuthService);

    function AuthService($http) {

        var api = {
            "getAuthorization": getAuthorization
        };
        return api;

        function getAuthorization(clientId, redirectUri) {
            var params = {
                client_id: clientId,
                response_type: "code",
                redirect_uri: redirectUri
            }
            return $http.get('/api/oauth2/authorize', {params: params});
        }

    }


    })();