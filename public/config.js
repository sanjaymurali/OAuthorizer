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

        var loggedIn = function ($q, $stateParams, $state, UserService) {
            var userid = $stateParams.uid + "";
            var deferred = $q.defer();
            UserService
                .loggedIn(userid)
                .then(function (response) {
                    console.log(response)
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
                url: '/'
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
                controllerAs: 'model'
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


            .state('sessionerror', {
                url: '/sessionexpired',
                templateUrl: 'views/errors/templates/sessionerror.view.client.html'
            })
            .state('notfound', {
                url: '/notfound',
                templateUrl: 'views/errors/templates/notfound.view.client.html'
            });

        $urlRouterProvider.otherwise('/');
    }

    MainAppModule.config(configuration);

})();