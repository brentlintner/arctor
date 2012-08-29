var childProcess = require('child_process'),
    fs = require('fs'),
    path = require('path'),
    connect = require('connect'),
    coverage_port = 7070,
    coverage_assets = __dirname + '/../../assets/cov',
    deps_folder = __dirname + '/../../deps',
    MOCHA_LOCAL = __dirname + "/../../node_modules/mocha/bin/mocha",
    COVERJS_LOCAL = __dirname + "/../../node_modules/coverjs/bin/coverjs";
        
function log(data) {
    process.stdout.write(new Buffer(data).toString("utf-8"))
}

function instrument(callback) {
    var args = ["-r", "-o", "cov", "lib", "test", "-e", "test/cov"],
        cmd = childProcess.spawn(COVERJS_LOCAL, args);

    cmd.on("exit", callback)
}

function test(reporter, callback) {
    var args = ["--recursive", "-R", reporter || "dot", "--require", "test/cov/reporter.js", "cov/test/unit"],
        cmd = childProcess.spawn(MOCHA_LOCAL, args);

    cmd.stdout.on("data", log);
    cmd.stderr.on("data", log);
    cmd.on("exit", callback)
}

function serveUpResults(callback) {
    var scripts =  [
            '<script src="script.js"></script>',
            '<script src="rainbow/js/rainbow.min.js"></script>',
            '<script src="rainbow/js/language/javascript.js"></script>' // TODO: get syntax highlighting working
        ],
        css = [
            '<link rel="stylesheet" href="rainbow/themes/solarized-dark.css" />',
            '<link rel="stylesheet" href="style.css" />'
        ],
        index_html = fs.readFileSync(path.join(coverage_assets, 'results.html'), "utf-8")
                  .replace(/<\/head>/i, css.join('') + scripts.join('') + "</head>");

    connect
        .createServer()
        .use(connect.static(coverage_assets))
        .use(connect.static(deps_folder))
        .use("/", function (req, res) { res.end(index_html) })
        .listen(coverage_port, function () {
            console.log("  coverage results at");
            console.log("    http://127.0.0.1:" + coverage_port);
            console.log();
            callback()
        })
}

function cleanup(callback) {
    childProcess.exec('rm -rf cov/', callback)
}

module.exports = function (reporter) {
    instrument(function () {
        test(reporter, function () {
            cleanup(function () {
                serveUpResults(complete);
            })
        })
    })
};
