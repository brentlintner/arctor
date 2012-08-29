var CSSLINT_LOCAL = __dirname + "/../../node_modules/csslint/cli.js",
    fs = require('fs');

module.exports = function () {
    var childProcess = require('child_process'),
        rules = JSON.parse(fs.readFileSync(__dirname + '/../../.csslintrc', 'utf-8').replace(/\/\/[^\n]*\n/g, '')),
        args = ['assets', '--quiet', '--errors=' + rules, '--format=compact', '--quiet'],
        cmd = childProcess.spawn(CSSLINT_LOCAL, args);

    function log(data) {
        process.stdout.write(new Buffer(data).toString('utf-8'))
    }

    cmd.stdout.on('data', log);
    cmd.stderr.on('data', log);
    cmd.on('exit', complete)
}
