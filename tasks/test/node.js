var MOCHA_LOCAL = __dirname + "/../../node_modules/mocha/bin/mocha";

module.exports = function (reporter) {
    var childProcess = require('child_process'),
        args = ["--recursive", "-R", reporter || "dot", "test/unit"],
        cmd = childProcess.spawn(MOCHA_LOCAL, args);

    function log(data) {
        process.stdout.write(new Buffer(data).toString("utf-8"))
    }

    cmd.stdout.on("data", log);
    cmd.stderr.on("data", log);
    cmd.on("exit", complete)
}
