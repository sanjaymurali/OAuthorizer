/**
 * Created by sanjaymurali on 2/9/17.
 */

(function () {
    angular
        .module("MainApp")
        .factory('UserService', userService);

    function userService($http) {

        var apiURL = '/api/';

        var user = {};

        var api = {
            "createUser": createUser,
            "updateUser": updateUser,
            "deleteUser": deleteUser,
            "findUserByCredentials": findUserByCredentials,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "login": login,
            "logout": logout,
            "checkSession": checkSession,
            "loggedIn": loggedIn,
            "register": register,
            "getUser": getUser,
            "setUser": setUser
        };
        return api;

        function loggedIn(userid) {
            return $http.get('/api/checksession/',{params: {userid: userid}});
        }

        function checkSession() {
            return $http.get('/api/checksession/');
        }

        function register(user) {
            return $http.post('/api/register/', user);
        }

        function updateUser(userId, newUser) {
            return $http.put(apiURL + 'user/' + userId, newUser);
        }

        function createUser(user) {
            return $http.post(apiURL + 'user', user);
        }

        function deleteUser(userId) {
            return $http.delete(apiURL + 'user/' + userId);
        }

        function findUserById(uid) {
            return $http.get(apiURL + 'user/' + uid);
        }

        function findUserByCredentials(username, password) {
            return $http.get(apiURL + 'user', {params: {username: username, password: password}});
        }

        function findUserByUsername(username) {
            return $http.get(apiURL + 'user', {params: {username: username}});
        }

        function login(user) {
            return $http.post("/api/login", user);
        }

        function logout() {
            return $http.post('/api/logout');
        }

        function getUser() {
            return this.user;
        }

        function setUser(user) {
            this.user = user;
        }

    }
})();