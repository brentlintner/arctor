var connect = require('connect'),
    path = require('path'),
    c = require('./conf'),
    utils = require('./utils');

// TODO: rename to graph.js
// boot -> create
module.exports = {
    create: function (deps) {
        connect
            .createServer()
            .use('/deps.js', function (req, res) {
                res.end(deps)
            })
            .use('/lib', connect.static(path.join(c.root, 'lib')))
            .use(connect.static(path.join(c.root, 'assets/graph')))
            .use(connect.static(path.join(c.root, 'deps')))
            .listen(c.ports.graph, function () {
                utils.log("  listening on: http://127.0.0.1:" + c.ports.graph)
            })
    }
};
