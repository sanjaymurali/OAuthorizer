/**
 * Created by sanjaymurali on 2/7/17.
 */

(function () {
    var MainAppModule = angular.module('MainApp');

    var configuration = function ($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider, $httpProvider) {
        $locationProvider.html5Mode({
            enabled: true
        });

        $urlMatcherFactoryProvider.strictMode(false); //To ignore diff b/w trailing slash

        $urlRouterProvider.when('/user/', '/login'); //look at this , if there are problems

        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        //$httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        var checkSession = function ($q, $stateParams, $state, UserService) {
            var deferred = $q.defer();
            UserService
                .checkSession()
                .then(function (response) {
                    if(!response.data.success) {
                        deferred.reject(null);
                        $state.go('sessionerror');
                    }
                    else{
                        UserService.setUser(response.data.user);
                        deferred.resolve(response.data.user);
                    }
                }, function(err){
                    deferred.reject();
                    $state.go('sessionerror');
                });
            return deferred.promise;
        };

        var guestLogin = function ($q, $stateParams, $state, UserService) {
            var deferred = $q.defer();
            UserService
                .checkSession()
                .then(function (response) {
                    if(!response.data.success) {
                        UserService.setUser(null);
                        deferred.resolve(null);
                    }
                    else{
                        UserService.setUser(response.data.user);
                        deferred.resolve(response.data.user);
                    }
                }, function(err){
                    UserService.setUser(null);
                    deferred.resolve(null);
                });
            return deferred.promise;
        };

        var loggedIn = function ($q, $stateParams, $state, UserService) {
            var userid = $stateParams.uid + "";
            var deferred = $q.defer();
            UserService
                .loggedIn(userid)
                .then(function (response) {
                    if(!response.data.success) {
                        deferred.reject(null);
                        $state.go('sessionerror');
                    }
                    else{
                        UserService.setUser(response.data.user);
                        deferred.resolve(response.data.user)
                    }
                }, function(err){
                    deferred.reject();
                    $state.go('sessionerror');
                });
            return deferred.promise;
        };

        var adminLogin = function ($q, $stateParams, $state, AdminService, UserService) {
            var deferred = $q.defer();
            AdminService
                .checkSession()
                .then(function (response) {
                    if(!response.data.success) {
                        deferred.reject(null);
                        $state.go('sessionerror');
                    }
                    else{
                        UserService.setUser(response.data.user);
                        deferred.resolve(response.data.user)
                    }
                }, function(err){
                    deferred.reject();
                    $state.go('sessionerror');
                });
            return deferred.promise;
        };


        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'views/landing/templates/guest.landing.view.client.html',
                controller: 'guestController',
                controllerAs: 'model',
                resolve: {guestLogin: guestLogin}
            })
            .state('about', {
                url: '/aboutus',
                templateUrl: 'views/landing/templates/about.us.view.client.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/user/templates/login.view.client.html',
                controller: 'loginController',
                controllerAs: 'model'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/user/templates/register.view.client.html',
                controller: 'registerController',
                controllerAs: 'model',
                resolve: {guestLogin: guestLogin}
            })
            .state('profile', {
                url: '/user/:uid',
                templateUrl: 'views/user/templates/profile.view.client.html',
                controller: 'profileController',
                controllerAs: 'model',
                resolve: {checkSession: checkSession}
            })
            .state('app-page', {
                url: '/app/:appid',
                templateUrl: 'views/application/templates/application.view.client.html',
                controller: 'appProfileController',
                controllerAs: 'model',
                resolve: {checkSession: checkSession}
            })
            .state('all-apps', {
                url: '/apps',
                templateUrl: 'views/application/templates/showall.view.client.html',
                controller: 'allAppsController',
                controllerAs: 'model',
                resolve: {checkSession: checkSession}
            })
            .state('profile-edit', {
                url: '/user/:uid/edit',
                templateUrl: 'views/user/templates/profile-edit.view.client.html',
                controller: 'profileEditController',
                controllerAs: 'model',
                resolve: {loggedIn: loggedIn}
            })

            .state('search', {
                url: '/search',
                templateUrl: 'views/search/templates/search.view.client.html',
                controller: 'searchController',
                controllerAs: 'model',
                resolve: {checkSession: checkSession}
            })

            .state('admin', {
                url: '/admin',
                templateUrl: 'views/admin/templates/admin.view.client.html',
                controller: 'adminController',
                controllerAs: 'model',
                resolve: {adminLogin: adminLogin} // Change!
            })
            .state('adminCreateUser', {
                url: '/admincreateuser',
                templateUrl: 'views/admin/templates/admin.create.user.view.client.html',
                controller: 'adminCreateUserController',
                controllerAs: 'model',
                resolve: {adminLogin: adminLogin} // Change!
            })
            .state('adminEditUser', {
                url: '/adminedituser/:uid',
                templateUrl: 'views/admin/templates/admin.edit.user.view.client.html',
                controller: 'adminEditUserController',
                controllerAs: 'model',
                resolve: {adminLogin: adminLogin} // Change!
            })

            .state('show-authorization', {
                url: '/oauth/authorize?client_id&redirect_uri',
                templateUrl: 'views/oauth/templates/show.auth.view.client.html',
                controller: 'authController',
                controllerAs: 'model'
            })


            .state('sessionerror', {
                url: '/sessionexpired',
                templateUrl: 'views/errors/templates/sessionerror.view.client.html'
            })
            .state('notfound', {
                url: '/notfound',
                templateUrl: 'views/errors/templates/notfound.view.client.html'
            })
            .state('authproblem', {
                url: '/authproblem',
                templateUrl: 'views/errors/templates/authorization.problem.view.client.html'
            });

        $urlRouterProvider.otherwise('/');
    }

    MainAppModule.config(configuration);

})();