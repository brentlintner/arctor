module.exports = function () {
    var childProcess = require('child_process'),
        args = ['.', '--show-non-errors'],
        cmd = childProcess.spawn('jshint', args);

    function log(data) {
        process.stdout.write(new Buffer(data).toString('utf-8'));
    }

    cmd.stdout.on('data', log);
    cmd.stderr.on('data', log);
    cmd.on('exit', function (code) {
        complete();
        process.exit(code);
    });
};
