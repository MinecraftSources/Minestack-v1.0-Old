var controllers = angular.module('controllers', []);

controllers.controller('dashboardController', ['$scope', '$http', function($scope, $http){
    $http.get('/api/servers').success(function(data){
        $scope.servers = data;
    });
    $http.get('/api/players').success(function(data){
        $scope.players = data;
    });
}]);

controllers.controller('servertypesController', ['$scope', '$http', function($scope, $http){
    $http.get('/api/servertypes').success(function(data){
        $scope.servertypes = data;
    });
}]);

controllers.controller('addtypeController', ['$scope', '$http', function($scope, $http){
    $scope.action = "Add";
    $scope.add = true;
    $scope.newType = {};
    $scope.newType.local = {};
    $scope.newType.local.players = 1;
    $scope.newType.local.memory = 512;
    $scope.newType.local.number = 1;
    $scope.newType.local.plugins = [];
    $scope.save = function() {
        $http.post('/api/servertypes', $scope.newType).success(function(data) {
            console.log(data);
        });
    };
    $scope.plugin = {};
    $scope.addPlugin = function() {
        if ($scope.plugin.name == undefined) {
            return;
        }
        if ($scope.plugin.config == undefined) {
            return;
        }
        for (var i = 0; i < $scope.newType.local.plugins.length; i++) {
            var plugin = $scope.newType.local.plugins[i];
            if (plugin.name == $scope.plugin.name) {
                return;
            }
        }
        var plugin = {
            name: $scope.plugin.name,
            config: $scope.plugin.config
        };
        $scope.newType.local.plugins.push(plugin)
    };
    $scope.removePlugin = function(plugin) {

        for (var i = 0; i < $scope.newType.local.plugins.length; i++) {
            var pluginOld = $scope.newType.local.plugins[i];
            if (pluginOld.name == plugin.name && pluginOld.config == plugin.config) {
                $scope.newType.local.plugins.splice(i,  1);
                break;
            }
        }
    };
    $http.get('/api/plugins').success(function(data){
        $scope.plugins = data;
    });
}]);

controllers.controller('edittypeController', ['$scope', '$http', '$routeParams', function($scope, $http,  $routeParams){
    $scope.action = "Edit";
    $scope.add = false;
    $scope.newType = {};
    $scope.remove = function() {
        $http.delete('/api/servertypes/'+$scope.newType._id).success(function(data) {
            console.log(data);
        });
    };
    $scope.save = function() {
        $http.post('/api/servertypes/'+$scope.newType._id, $scope.newType).success(function(data) {
            console.log(data);
        });
    };
    $scope.plugin = {};
    $scope.addPlugin = function() {
        if ($scope.plugin.name == undefined) {
            return;
        }
        if ($scope.plugin.config == undefined) {
            return;
        }
        for (var i = 0; i < $scope.newType.local.plugins.length; i++) {
            var plugin = $scope.newType.local.plugins[i];
            if (plugin.name == $scope.plugin.name) {
                return;
            }
        }
        var plugin = {
            name: $scope.plugin.name,
            config: $scope.plugin.config
        };
        $scope.newType.local.plugins.push(plugin)
    };
    $scope.removePlugin = function(plugin) {

        for (var i = 0; i < $scope.newType.local.plugins.length; i++) {
            var pluginOld = $scope.newType.local.plugins[i];
            if (pluginOld.name == plugin.name && pluginOld.config == plugin.config) {
                $scope.newType.local.plugins.splice(i,  1);
                break;
            }
        }
    };
    $http.get('/api/plugins').success(function(data){
        $scope.plugins = data;
    });
    $http.get('/api/serverTypes/'+$routeParams.type).success(function(data){
        $scope.servertype = data;
        $scope.newType = $scope.servertype;
    });
}]);

controllers.controller('pluginsController', ['$scope', '$http', function($scope, $http){
    $http.get('/api/plugins').success(function(data){
        $scope.plugins = data;
    });
}]);

controllers.controller('editPluginController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $scope.action = "Edit";
    $scope.add = false;
    $scope.newPlugin = {};
    $scope.remove = function() {
        $http.delete('/api/plugins/'+$scope.newPlugin._id).success(function(data) {
            console.log(data);
        });
    };
    $scope.addConfig = function() {
        if ($scope.config.name == undefined) {
            return;
        }
        if ($scope.config.location == undefined) {
            return;
        }
        for (var i = 0; i < $scope.newPlugin.local.configs.length; i++) {
            var config = $scope.newPlugin.local.configs[i];
            if (config.name == $scope.config.name) {
                return;
            }
        }
        var plugin = {
            name: $scope.config.name,
            location: $scope.config.location
        };
        $scope.newPlugin.local.configs.push(plugin)
    };
    $scope.removeConfig = function(config) {

        for (var i = 0; i < $scope.newPlugin.local.configs.length; i++) {
            var configOld = $scope.newPlugin.local.configs[i];
            if (configOld.name == config.name && configOld.location == config.location) {
                $scope.newPlugin.local.configs.splice(i,  1);
                break;
            }
        }
    };
    $scope.save = function() {
        if ($scope.newPlugin.local.configs.length == 0) {
            //error must have at least one config
            return;
        }
        $http.post('/api/plugins/'+$scope.newPlugin._id, $scope.newPlugin).success(function(data) {
            console.log(data);
        });
    };
    $http.get('/api/plugins/'+$routeParams.type).success(function(data){
        $scope.plugin = data;
        $scope.newPlugin = $scope.plugin;
    });
}]);

controllers.controller('addPluginController', ['$scope', '$http', function($scope, $http){
    $scope.action = "Add";
    $scope.add = false;
    $scope.newPlugin = {};
    $scope.newPlugin.local = {};
    $scope.newPlugin.local.configs = [];
    $scope.remove = function() {
        $http.delete('/api/plugins/'+$scope.newPlugin._id).success(function(data) {
            console.log(data);
        });
    };
    $scope.addConfig = function() {
        if ($scope.config.name == undefined) {
            return;
        }
        if ($scope.config.location == undefined) {
            return;
        }
        for (var i = 0; i < $scope.newPlugin.local.configs.length; i++) {
            var config = $scope.newPlugin.local.configs[i];
            if (config.name == $scope.config.name) {
                return;
            }
        }
        var plugin = {
            name: $scope.config.name,
            location: $scope.config.location
        };
        $scope.newPlugin.local.configs.push(plugin)
    };
    $scope.removeConfig = function(config) {

        for (var i = 0; i < $scope.newPlugin.local.configs.length; i++) {
            var configOld = $scope.newPlugin.local.configs[i];
            if (configOld.name == config.name && configOld.location == config.location) {
                $scope.newPlugin.local.configs.splice(i,  1);
                break;
            }
        }
    };
    $scope.save = function() {
        if ($scope.newPlugin.local.configs.length == 0) {
            //error must have at least one config
            return;
        }
        $http.post('/api/plugins/'+$scope.newPlugin._id, $scope.newPlugin).success(function(data) {
            console.log(data);
        });
    };
}]);