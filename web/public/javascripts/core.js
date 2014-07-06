var dashboard = angular.module('dashboard', ['controllers', 'ngRoute']);

dashboard.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/dashboard-view',
                controller: 'dashboardController'
            })
            .when('/servertypes', {
                templateUrl: '/partials/servertypes-view',
                controller: 'servertypesController'
            })
            .when ('/edittype', {
                redirectTo: '/servertypes'
            })
            .when('/edittype/:type', {
                templateUrl: '/partials/edittype-view',
                controller: 'edittypeController'
            })
            .when('/addtype', {
                templateUrl: '/partials/edittype-view',
                controller: 'addtypeController'
            })
            .when('/plugins', {
                templateUrl: '/partials/plugins-view',
                controller: 'pluginsController'
            })
            .when('/editplugin', {
                redirectTo: '/plugins'
            })
            .when('/editplugin/:type', {
                templateUrl: '/partials/editplugin-view',
                controller: 'editPluginController'
            })
            .when('/addplugin', {
                templateUrl: '/partials/editplugin-view',
                controller: 'addPluginController'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    }]);

