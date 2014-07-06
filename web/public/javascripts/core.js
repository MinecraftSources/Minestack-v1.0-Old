var dashboard = angular.module('dashboard', ['controllers', 'ngRoute']);

dashboard.factory('AuthenticationService', function() {
    var auth = {
        isLogged: false
    };

    return auth;
});

dashboard.factory('authInterceptor', ['$rootScope', '$q', '$window', '$location', function ($rootScope, $q, $window, $location) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            console.log(config.headers);
            return config;
        },response: function(response) {
            if (response.status === 401) {
            }
            //return $q.reject(response);
            return response || $q.when(response);
        }
    };
}]);

dashboard.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});

dashboard.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/dashboard-view',
                controller: 'dashboardController',
                access: { requiredLogin: true }
            })
            .when('/servertypes', {
                templateUrl: '/partials/servertypes-view',
                controller: 'servertypesController',
                access: { requiredLogin: true }
            })
            .when ('/edittype', {
                redirectTo: '/servertypes',
                access: { requiredLogin: true }
            })
            .when('/edittype/:type', {
                templateUrl: '/partials/edittype-view',
                controller: 'edittypeController',
                access: { requiredLogin: true }
            })
            .when('/addtype', {
                templateUrl: '/partials/edittype-view',
                controller: 'addtypeController',
                access: { requiredLogin: true }
            })
            .when('/plugins', {
                templateUrl: '/partials/plugins-view',
                controller: 'pluginsController',
                access: { requiredLogin: true }
            })
            .when('/editplugin', {
                redirectTo: '/plugins',
                access: { requiredLogin: true }
            })
            .when('/editplugin/:type', {
                templateUrl: '/partials/editplugin-view',
                controller: 'editPluginController',
                access: { requiredLogin: true }
            })
            .when('/addplugin', {
                templateUrl: '/partials/editplugin-view',
                controller: 'addPluginController',
                access: { requiredLogin: true }
            })
            .when('/session', {
                templateUrl: '/partials/login-view',
                controller: 'sessionController',
                access: { requiredLogin: false }
            })
            .when('/session/forgot', {
                templateUrl: '/partials/forgot-view',
                controller: 'sessionController',
                access: { requiredLogin: false }
            })
            .otherwise({
                redirectTo: '/',
                access: { requiredLogin: true }
            });
        $locationProvider.html5Mode(true);
    }]);

dashboard.run(function($rootScope, $window, $location, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged && !$window.sessionStorage.token) {
            $location.path("/session");
        }
    });
});
