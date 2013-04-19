var cli = require('cli').enable('help'),
    path = require('path'),
    fs = require('fs'),
    c = require('./conf'),
    utils = require('./utils'),
    graph = require('./graph'),
    scanner = require('./scanner');

module.exports = {
    interpret: function (args) {
        cli.setArgv(args);

        var opts = cli.parse(c.cli.usage),
            targets = cli.args;

        if (opts.version) {
            cli.setApp(path.join(c.root, "package.json"));
            utils.log(cli.version)
            return
        }

        if (opts.help || !targets.length) {
            cli.getUsage();
            return
        }

        if (targets) {
            scanner.search(targets, null, function (error, deps) {
                var json = JSON.stringify(deps);

                if (opts.graph) {
                    graph.create("var deps = " + json + ";")
                } else if (opts.output) {
                    fs.writeFileSync(path.join(process.cwd(), opts.output), json, 'utf-8')
                } else {
                    utils.log(json)
                }
            });
        }
    }
};
