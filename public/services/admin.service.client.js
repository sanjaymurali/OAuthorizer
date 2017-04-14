/**
 * Created by sanjaymurali on 2/9/17.
 */

(function () {
    angular
        .module("MainApp")
        .factory('AdminService', adminService);

    function adminService($http) {

        var apiURL = '/api/';

        var user = {};

        var api = {
            "findAllUsers": findAllUsers,
            "createUser": createUser,
            "deleteUser": deleteUser,
            "findUserById": findUserById,
            "updateUser": updateUser,
            "checkSession": checkSession
        };
        return api;

        function findAllUsers() {
            return $http.get('/api/admin/allusers');
        }

        function createUser(user) {
            return $http.post('/api/admin/user', user);
        }

        function deleteUser(userId) {
            return $http.delete('/api/admin/user/' + userId);
        }

        function findUserById(userid) {
            return $http.get('/api/admin/user/' + userid);
        }

        function updateUser(userId, newUser) {
            return $http.put('/api/admin/user/' + userId, newUser);
        }

        function checkSession() {
            return $http.get('/api/admin/checksession/');
        }


    }
})();