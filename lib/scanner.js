var utils = require('./utils'),
    path = require('path'),
    fs = require('fs');

module.exports = {
    search: function (targets, opts, done) {
        var dependencies = {};

        targets.forEach(function (target) {
            utils.collect(target).forEach(function (file) {
                var name = file.replace(/\.js$/, ''),
                    data = fs.readFileSync(path.join(process.cwd(), file), "utf-8"),
                    match = data.match(/require\([\'\"]([\w\d\/\.]*)[\'\"]\)/g);

                if (opts.truncatePrefix) {
                    name = name.replace(new RegExp("^" + opts.truncatePrefix), '');
                }

                dependencies[name] = [];

                if (match) {
                    match.map(function (statement) {
                        return statement.replace(/require\([\"\']/, '').replace(/[\"\']\)/, '');
                    }).forEach(function (def) {
                        var relative = !!def.match(/^\.\.?\/?/);

                        dependencies[name].push({
                            relative: relative,
                            path: !relative ? def : path.join(path.basename(target), path.normalize(def))
                        });
                    });
                }
            });
        });

        done(dependencies);
    }
};
