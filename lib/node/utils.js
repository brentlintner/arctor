var fs = require('fs'),
    path = require('path'),
    c = require('./conf');

function collectJSFiles(target) {
    var files = [];

    (function collect(p) {
        if (fs.statSync(p).isDirectory()) {
            fs.readdirSync(p).forEach(function (item) {
                collect(path.join(p, item))
            })
        } else if (p.match(c.regex.jsfile)) {
            files.push(p)
        }
    }(target));

    return files
}

module.exports = {
    collect: collectJSFiles,
    log: console.log
};
