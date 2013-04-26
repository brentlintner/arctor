var JSHINT_LOCAL = __dirname + "/../../node_modules/.bin/jshint";

module.exports = function () {
    var childProcess = require('child_process'),
        args = ['.', '--show-non-errors'],
        cmd = childProcess.spawn(JSHINT_LOCAL, args);

    function log(data) {
        process.stdout.write(new Buffer(data).toString('utf-8'))
    }

    cmd.stdout.on('data', log);
    cmd.stderr.on('data', log);
    cmd.on('exit', complete)
}
