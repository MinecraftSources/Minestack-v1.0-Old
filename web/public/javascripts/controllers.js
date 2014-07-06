var controllers = angular.module('controllers', []);

controllers.controller('sessionController', ['$scope', '$http', '$location', '$window', 'AuthenticationService', function ($scope, $http, $location, $window, AuthenticationService) {
    $scope.loginData = {};
    $scope.hasError = false;
    $scope.error = "";

    $scope.forgot = function() {
        $http.post('/session/forgot', $scope.loginData).success(function (data) {
            console.log(data);
            $scope.hasError = true;
            $scope.error = 'A reset URL has been sent to the supplied email.';
        }).error(function (data) {
            console.log(data);
            $scope.hasError = true;
            $scope.error = data.error;
        });
    };

    $scope.login = function () {
        $http.post('/session', $scope.loginData).success(function (data) {
            console.log(data);
            AuthenticationService.isLogged = true;
            $window.sessionStorage.token = data.token;
            $location.path('/');
        }).error(function (data) {
            console.log(data);
            delete $window.sessionStorage.token;
            $scope.hasError = true;
            $scope.error = data.error;
        });
    }
}]);

controllers.controller('dashboardController', ['$scope', '$http', function ($scope, $http) {

    $http.get('/api/servers').success(function (data) {
        $scope.servers = data;
    });
    $http.get('/api/players').success(function (data) {
        $scope.players = data;
    });
}]);

controllers.controller('servertypesController', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    $scope.edit = function (type) {
        $location.path('/edittype/' + type);
    };

    $http.get('/api/servertypes').success(function (data) {
        $scope.servertypes = data;
    });
}]);

controllers.controller('addtypeController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.action = "Add";
    $scope.add = true;
    $scope.newType = {};
    $scope.newType.local = {};
    $scope.newType.local.players = 1;
    $scope.newType.local.memory = 512;
    $scope.newType.local.number = 1;
    $scope.newType.local.plugins = [];
    $scope.plugin = {};
    $scope.config = {};
    $scope.hasError = false;
    $scope.error = "";

    $scope.cancel = function () {
        $location.path('/servertypes');
    };

    $scope.needsPlugin = function () {
        for (var i = 0; i < $scope.newType.local.plugins.length; i++) {
            var plugin = $scope.newType.local.plugins[i];
            if (plugin.name == 'MN2Bukkit') {
                return false;
            }
        }
        return true;
    };

    $scope.save = function () {
        $http.post('/api/servertypes', $scope.newType).success(function (data) {
            console.log(data);
            if (data.errorCode == 0) {
                $location.path('/servertypes')
            } else {
                $scope.hasError = true;
                $scope.error = data.error;
            }
        });
    };
    $scope.addPlugin = function () {
        if ($scope.plugin.local == undefined) {
            return;
        }
        if (Object.keys($scope.config).length == 0) {
            return;
        }
        for (var i = 0; i < $scope.newType.local.plugins.length; i++) {
            var plugin = $scope.newType.local.plugins[i];
            if (plugin.name == $scope.plugin.name) {
                return;
            }
        }
        var plugin = {
            name: $scope.plugin.local.name,
            config: $scope.config.name
        };
        $scope.newType.local.plugins.push(plugin);
        $scope.plugin = {};
        $scope.config = {};
    };
    $scope.removePlugin = function (plugin) {

        for (var i = 0; i < $scope.newType.local.plugins.length; i++) {
            var pluginOld = $scope.newType.local.plugins[i];
            if (pluginOld.name == plugin.name && pluginOld.config == plugin.config) {
                $scope.newType.local.plugins.splice(i, 1);
                break;
            }
        }
    };
    $http.get('/api/plugins').success(function (data) {
        $scope.plugins = data;
    });
}]);

controllers.controller('edittypeController', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
    $scope.action = "Edit";
    $scope.add = false;
    $scope.newType = {};
    $scope.plugin = {};
    $scope.config = {};
    $scope.hasError = false;
    $scope.error = "";

    $scope.cancel = function () {
        $location.path('/servertypes');
    };

    $scope.needsPlugin = function () {
        for (var i = 0; i < $scope.newType.local.plugins.length; i++) {
            var plugin = $scope.newType.local.plugins[i];
            if (plugin.name == 'MN2Bukkit') {
                return false;
            }
        }
        return true;
    };

    $scope.remove = function () {
        $http.delete('/api/servertypes/' + $scope.newType._id).success(function (data) {
            console.log(data);
            if (data.errorCode == 0) {
                $location.path('/servertypes')
            } else {
                $scope.hasError = true;
                $scope.error = data.error;
            }
        });
    };
    $scope.save = function () {
        $http.post('/api/servertypes/' + $scope.newType._id, $scope.newType).success(function (data) {
            console.log(data);
            if (data.errorCode == 0) {
                $location.path('/servertypes');
            } else {
                $scope.hasError = true;
                $scope.error = data.error;
            }
        });
    };
    $scope.addPlugin = function () {
        if ($scope.plugin.local == undefined) {
            return;
        }
        if (Object.keys($scope.config).length == 0) {
            return;
        }
        for (var i = 0; i < $scope.newType.local.plugins.length; i++) {
            var plugin = $scope.newType.local.plugins[i];
            if (plugin.name == $scope.plugin.name) {
                return;
            }
        }
        var plugin = {
            name: $scope.plugin.local.name,
            config: $scope.config.name
        };
        $scope.newType.local.plugins.push(plugin);
        $scope.plugin = {};
        $scope.config = {};
    };
    $scope.removePlugin = function (plugin) {

        for (var i = 0; i < $scope.newType.local.plugins.length; i++) {
            var pluginOld = $scope.newType.local.plugins[i];
            if (pluginOld.name == plugin.name && pluginOld.config == plugin.config) {
                $scope.newType.local.plugins.splice(i, 1);
                break;
            }
        }
    };
    $http.get('/api/plugins').success(function (data) {
        $scope.plugins = data;
    });
    $http.get('/api/serverTypes/' + $routeParams.type).success(function (data) {
        $scope.servertype = data;
        $scope.newType = $scope.servertype;
    });
}]);

controllers.controller('pluginsController', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    $scope.edit = function (plugin) {
        $location.path('/editplugin/' + plugin);
    };

    $http.get('/api/plugins').success(function (data) {
        $scope.plugins = data;
    });
}]);

controllers.controller('editPluginController', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
    $scope.action = "Edit";
    $scope.add = false;
    $scope.newPlugin = {};
    $scope.hasError = false;
    $scope.error = "";

    $scope.cancel = function () {
        $location.path('/plugins');
    };

    $scope.needsConfig = function () {
        return $scope.newPlugin.local.configs.length <= 0;
    };

    $scope.remove = function () {
        $http.delete('/api/plugins/' + $scope.newPlugin._id).success(function (data) {
            console.log(data);
            if (data.errorCode == 0) {
                $location.path('/plugins');
            } else {
                $scope.hasError = true;
                $scope.error = data.error;
            }
        });
    };
    $scope.addConfig = function () {
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
    $scope.removeConfig = function (config) {

        for (var i = 0; i < $scope.newPlugin.local.configs.length; i++) {
            var configOld = $scope.newPlugin.local.configs[i];
            if (configOld.name == config.name && configOld.location == config.location) {
                $scope.newPlugin.local.configs.splice(i, 1);
                break;
            }
        }
    };
    $scope.save = function () {
        $http.post('/api/plugins/' + $scope.newPlugin._id, $scope.newPlugin).success(function (data) {
            console.log(data);
            if (data.errorCode == 0) {
                $location.path('/plugins');
            } else {
                $scope.hasError = true;
                $scope.error = data.error;
            }
        });
    };
    $http.get('/api/plugins/' + $routeParams.type).success(function (data) {
        $scope.plugin = data;
        $scope.newPlugin = $scope.plugin;
    });
}]);

controllers.controller('addPluginController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.action = "Add";
    $scope.add = true;
    $scope.newPlugin = {};
    $scope.newPlugin.local = {};
    $scope.newPlugin.local.configs = [];
    $scope.hasError = false;
    $scope.error = "";
    $scope.needsConfig = function () {
        return $scope.newPlugin.local.configs.length <= 0;
    };

    $scope.cancel = function () {
        $location.path('/plugins');
    };

    $scope.addConfig = function () {
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
    $scope.removeConfig = function (config) {

        for (var i = 0; i < $scope.newPlugin.local.configs.length; i++) {
            var configOld = $scope.newPlugin.local.configs[i];
            if (configOld.name == config.name && configOld.location == config.location) {
                $scope.newPlugin.local.configs.splice(i, 1);
                break;
            }
        }
    };
    $scope.save = function () {
        $http.post('/api/plugins/' + $scope.newPlugin._id, $scope.newPlugin).success(function (data) {
            console.log(data);
            if (data.errorCode == 0) {
                $location.path('/plugins');
            } else {
                $scope.hasError = true;
                $scope.error = data.error;
            }
        });
    };
}]);