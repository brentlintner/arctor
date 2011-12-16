var argsparser = require('argsparser'),
    fs = require('fs'),
    path = require('path'),
    server = require('./server'),
    scanner = require('./scanner');

function _help() {
    process.stdout.write(fs.readFileSync(__dirname + "/../HELP", "utf-8"));
}

function _version() {
    process.stdout.write(JSON.parse(fs.readFileSync(__dirname + "/../package.json", "utf-8")).version + "\n");
}

module.exports = {
    interpret: function (args) {
        var options = argsparser.parse(args),
            targets = typeof options.node === "string" ? null : options.node.slice(1);

        if (options["-v"] || options["--version"]) {
            _version();
            return;
        }

        if (targets) {
            scanner.search(targets, {
                truncatePrefix: options["--truncate-prefix"]
            }, function (deps) {
                if (options["-s"] || options["--server"]) {
                    server.boot("var deps = " + JSON.stringify(deps) + ";");
                } else {
                    process.stdout.write(JSON.stringify(deps) + "\n");
                }
            });
            return;
        }

        _help();
    }
};

