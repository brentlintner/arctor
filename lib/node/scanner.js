var path = require('path'),
    fs = require('fs'),
    detective = require('detective'),
    utils = require('./utils'),
    c = require('./conf'),
    self;

function intoDependencyObjList(targetFilePath, currentList, depPath) {
    var relativePath = !!depPath.match(c.regex.relative_prefix),
        potentialLoc, external;

    depPath = depPath.replace(c.regex.relative_prefix, '')
                     .replace(c.regex.jsfile, '');

    potentialLoc = path.join(process.cwd(),
                             path.join(path.dirname(targetFilePath), depPath)) + '.js';

    if (relativePath && fs.existsSync(potentialLoc)) {
        depPath = path.join(path.dirname(targetFilePath), depPath)
    } else { external = true }

    depPath = depPath.replace(c.regex.relative_require, '');

    currentList.push({external: !!external, path: depPath});

    return currentList
}

function scan(targets, opts, done) {
    var dependencies = {},
        error = null;

    if (!opts) { opts = {} }

    targets.forEach(function (target) {
        utils.collect(target).forEach(function (filepath) {
            var name = filepath.replace(c.regex.jsfile, ''),
                fileData = fs.readFileSync(path.join(process.cwd(), filepath), "utf-8"),
                requires = detective(fileData);
            dependencies[name] = requires.reduce(intoDependencyObjList.bind(self, filepath), [])
        });
    });

    done(error, dependencies)
}

self = {
    search: scan
};

module.exports = self;
