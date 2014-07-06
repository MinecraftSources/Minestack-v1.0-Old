var express = require('express');
var router = express.Router();
var Plugin = require('../models/plugin');
var ServerType = require('../models/servertype');
var async = require('async');

router.get('/', function (req, res) {
    res.send('some api');
});

router.get('/servers', function (req, res) {
    req.app.locals.etcd.get("/mn2/servers", function (error, body, resp) {
        var servers = [];
        if (error || !body.node.nodes) {
        } else {
            body.node.nodes.forEach(function (node) {
                var uuid = node.key.replace('/mn2/servers/', '');
                servers.push({ uuid: uuid, type: node.value.type, players: node.value.players, node: node.value.node, port: node.value.port, service: node.value.service });
            });
        }
        servers.push({ uuid: 'fdhgfdhsdhd' });
        servers.push({ uuid: 'fdhgfdhsdhd' });
        res.send(servers);
    });
});

router.get('/servers/:server', function (req, res) {
    req.app.locals.etcd.get("/mn2/servers/" + req.param("server"), function (error, body, resp) {
        if (error) {
            res.contentType('application/json');
            res.send({ errorCode: 1, error: 'Unknown server ' + req.param("server") });
            return;
        }
        res.contentType('application/json');
        res.send(body.node.value);
    });
});

router.get('/servers/type/:serverType', function (req, res) {
    req.app.locals.etcd.get("/mn2/servers", function (error, body, resp) {
        if (error || !body.node.nodes) {
            res.contentType('application/json');
            res.send(JSON.stringify({ servers: [] }));
            return;
        }
        var servers = [];
        body.node.nodes.forEach(function (node) {
            if (node.value.type == req.param("serverType")) {
                uuid = node.key.replace('/mn2/servers/', '');
                servers.push(uuid);
            }
        });
        res.contentType('application/json');
        res.send(JSON.stringify({ servers: servers }));
    });
});

router.get('/players', function (req, res) {
    req.app.locals.etcd.get("/mn2/players", function (error, body, resp) {
        var players = [];
        if (error || !body.node.nodes) {
        } else {
            body.node.nodes.forEach(function (node) {
                var uuid = node.key.replace('/mn2/players/', '');
                players.push({ uuid: uuid});
            });
        }
        res.send(players);
    });
});

router.get('/players/:player', function (req, res) {
    req.app.locals.etcd.get("/mn2/players/" + req.param("player"), function (error, body, resp) {
        if (error) {
            res.contentType('application/json');
            res.send({ errorCode: 1, error: 'Unknown player ' + req.param("player") });
            return;
        }
        res.contentType('application/json');
        res.send(body.node.value);
    });
});

router.get('/plugins', function (req, res) {
    Plugin.find({}, function (error, plugins) {
        if (error) {
            res.send(error);
        }
        res.json(plugins);
    });
});

router.get('/plugins/:plugin', function (req, res) {
    async.waterfall([
        function (done) {
            Plugin.findOne({ '_id': req.param('plugin')}, function (error, plugin) {
                if (plugin) {
                    done(error, plugin);
                } else {
                    done(error, { errorCode: 1, error: 'No such plugin ' + req.param('plugin')});
                }
            });
        }
    ], function (error, result) {
        res.contentType('application/json');
        res.send(result);
    });
});

router.post('/plugins/:plugin', function (req, res) {
    modifyPlugin(req, res);
});

router.delete('/plugins/:plugin', function (req, res) {
    async.waterfall([
        function (done) {
            var id = req.param('plugin');
            var resp = {
                errorCode: 0,
                error: ''
            };
            Plugin.findOne({ _id: id}, function (error, plugin) {
                if (error) {
                    resp.errorCode = 2;
                    resp.error = 'Database Error finding plugin';
                }
                if (!plugin) {
                    resp.errorCode = 1;
                    resp.error = 'Cloud not find plugin ' + id;
                }
                done(error, resp, plugin);
            });
        },
        function (resp, plugin, done) {
            if (resp.errorCode == 0) {
                Plugin.remove({ _id: plugin._id}, function (error) {
                    if (error) {
                        resp.errorCode = 2;
                        resp.error = 'Database Error removing plugin';
                    }
                    done(error, resp, plugin);
                });
            } else {
                done(null, resp, plugin);
            }
        },
        function (resp, plugin, done) {
            if (resp.errorCode == 0) {
                ServerType.update({ 'local.plugins.name': plugin.local.name }, { '$pull': { 'local.plugins': { 'name': plugin.local.name } } }, { 'multi': true }, function (error) {
                    if (error) {
                        resp.errorCode = 2;
                        resp.error = 'Database Error removing plugin from servers';
                    }
                    done(error, resp);
                })
            } else {
                done(null, resp);
            }
        }
    ], function (error, resp) {
        res.send(resp);
    });
});

router.post('/plugins', function (req, res) {
    modifyPlugin(req, res);
});

router.get('/serverTypes', function (req, res) {
    ServerType.find({}, function (error, servertypes) {
        if (error) {
            res.send(error);
        }
        res.json(servertypes);
    });
});

router.post('/serverTypes', function (req, res) {
    modifyType(req, res);
});

router.get('/serverTypes/:serverType', function (req, res) {
    async.waterfall([
        function (done) {
            ServerType.findOne({ '_id': req.param('serverType')}, function (error, servertype) {
                if (servertype) {
                    done(error, servertype);
                } else {
                    done(error, { errorCode: 1, error: 'No such server type ' + req.param('serverType')});
                }
            });
        }
    ], function (error, result) {
        res.contentType('application/json');
        res.send(result);
    });
});

router.post('/serverTypes/:serverType', function (req, res) {
    modifyType(req, res);
});

router.delete('/serverTypes/:serverType', function (req, res) {
    var id = req.param('serverType');
    var resp = {
        errorCode: 0,
        error: ''
    };
    ServerType.remove({ _id: id}, function (error) {
        if (error) {
            resp.errorCode = 2;
            resp.error = 'Database Error';
        }
        res.send(resp);
    })
});

module.exports = router;

function modifyType(req, res) {
    async.waterfall([
        function (done) {
            var resp = {
                errorCode: 0,
                error: ''
            };
            ServerType.find({ 'local.name': req.body.local.name }, function (error, servertypes) {
                if (error) {
                    resp.errorCode = 2;
                    resp.error = 'Database Error finding server type';
                }

                if (servertypes.length > 0) {
                    if (servertypes[0]._id != req.body._id) {
                        resp.errorCode = 1;
                        resp.error = req.body.local.name + ' already exists';
                    }
                }
                if (resp.errorCode == 0) {
                    done(null, resp);
                } else {
                    done(resp.errorCode, resp);
                }
            });
        },
        function (resp, done) {
            var pluginNames = [];
            for (var i = 0; i < req.body.local.plugins.length; i++) {
                pluginNames.push(req.body.local.plugins[i].name);
            }
            Plugin.find({ 'local.name': { '$in': pluginNames } }, function (error, plugins) {
                if (error) {
                    resp.errorCode = 2;
                    resp.error = 'Database Error finding plugins from server type';
                }
                if (plugins.length != req.body.local.plugins.length) {
                    resp.errorCode = 3;
                    resp.error = 'Some Plugins are missing from the database';
                }
                if (resp.errorCode == 0) {
                    done(null, resp);
                } else {
                    done(resp.errorCode, resp);
                }
            });
        },
        function (resp, done) {
            var error = null;
            if (req.body._id) {
                ServerType.findOne({ _id: req.body._id}, function (err, doc) {
                    if (err) {
                        resp.errorCode = 2;
                        resp.error = 'Database Error finding server type';
                        error = err;
                    }
                    if (doc) {
                        doc.local.name = req.body.local.name;
                        doc.local.players = req.body.local.players;
                        doc.local.memory = req.body.local.memory;
                        doc.local.number = req.body.local.number;
                        doc.local.plugins = req.body.local.plugins;
                        doc.save(function (err) {
                            if (err) {
                                resp.errorCode = 2;
                                resp.error = 'Database Error';
                                error = err;
                            }
                            if (resp.errorCode == 0) {
                                done(null, resp);
                            } else {
                                done(resp.errorCode, resp);
                            }
                        })
                    } else {
                        resp.errorCode = 2;
                        resp.error = 'Saving Error';
                        error = err;
                        if (resp.errorCode == 0) {
                            done(null, resp);
                        } else {
                            done(resp.errorCode, resp);
                        }
                    }
                });
            } else {
                var type = new ServerType(req.body);
                type.save(function (err) {
                    if (err) {
                        resp.errorCode = 2;
                        resp.error = 'Database Error';
                        error = err;
                    }
                    if (resp.errorCode == 0) {
                        done(null, resp);
                    } else {
                        done(resp.errorCode, resp);
                    }
                });
            }
        }
    ], function (error, resp) {
        res.send(resp);
    });
}

function modifyPlugin(req, res) {
    async.waterfall([
        function (done) {
            var resp = {
                errorCode: 0,
                error: ''
            };
            Plugin.find({ 'local.name': req.body.local.name }, function (error, plugins) {
                if (error) {
                    resp.errorCode = 2;
                    resp.error = 'Database Error finding plugin';
                }

                if (!req.body._id) {
                    if (plugins.length > 0) {
                        resp.errorCode = 1;
                        resp.error = req.body.local.name + ' already exists';
                    }
                }
                if (resp.errorCode == 0) {
                    done(null, resp);
                } else {
                    done(resp.errorCode, resp);
                }
            });
        },
        function (resp, done) {
            var error = null;
            if (req.body._id) {
                Plugin.findOne({ _id: req.body._id}, function (err, doc) {
                    if (err) {
                        resp.errorCode = 2;
                        resp.error = 'Database Error';
                        error = err;
                    }
                    if (doc) {
                        doc.local.name = req.body.local.name;
                        doc.local.git = req.body.local.git;
                        doc.local.folder = req.body.local.folder;
                        doc.local.configs = req.body.local.configs;
                        doc.save(function (err) {
                            if (err) {
                                resp.errorCode = 2;
                                resp.error = 'Database Error updating plugin';
                                error = err;
                            }
                            if (resp.errorCode == 0) {
                                done(null, resp);
                            } else {
                                done(resp.errorCode, resp);
                            }
                        })
                    } else {
                        resp.errorCode = 2;
                        resp.error = 'Saving Error';
                        error = err;
                        if (resp.errorCode == 0) {
                            done(null, resp);
                        } else {
                            done(resp.errorCode, resp);
                        }
                    }
                });
            } else {
                var type = new Plugin(req.body);
                type.save(function (err) {
                    if (err) {
                        resp.errorCode = 2;
                        resp.error = 'Database Error saving plugin';
                        error = err;
                    }
                    if (resp.errorCode == 0) {
                        done(null, resp);
                    } else {
                        done(resp.errorCode, resp);
                    }
                });
            }
        }
    ], function (error, resp) {
        res.send(resp);
    });
}
