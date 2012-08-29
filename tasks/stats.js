var fs = require('fs'),
    utils = require('./../lib/utils'),
    LIB = __dirname + "/../lib/",
    TEST = __dirname + "/../test/",
    EMPTY_SPACE_OR_SINGLE_LINE_COMMENTS = /^\s*(\/\/.*)?$/; // TODO: count /* ... */

function stat(file, callback) {
    var data = {lines: 0, loc: 0};

    fs.readFileSync(file, "utf-8")
        .replace(/\n$/, '')
        .split("\n")
        .forEach(function (line) {
            data.lines++;
            if (line && !line.match(EMPTY_SPACE_OR_SINGLE_LINE_COMMENTS)) {
                data.loc++
            }
        });

    callback(data)
}

module.exports = function () {
    var lib = {files: [], lines: 0, loc: 0},
        test = {files: [], lines: 0, loc: 0},
        total = {lines: 0, loc: 0};

    lib.files = utils.collect(LIB);
    test.files = utils.collect(TEST);

    lib.files.sort();
    test.files.sort();

    lib.files.forEach(function (f) {
        stat(f, function (data) {
            lib.lines += data.lines;
            lib.loc += data.loc
        })
    });

    test.files.forEach(function (t) {
        stat(t, function (data) {
            test.lines += data.lines;
            test.loc += data.loc
        })
    });

    total.lines = lib.lines + test.lines;
    total.loc = lib.loc + test.loc;

    console.log();
    console.log("  lib/test code stats");
    console.log();

    console.log("  lib");
    console.log("    loc               " + lib.loc);
    console.log("    lines             " + lib.lines);
    console.log();

    console.log("  test");
    console.log("    loc               " + test.loc);
    console.log("    lines             " + test.lines);
    console.log();

    console.log("  total");
    console.log("    loc               " + total.loc);
    console.log("    lines             " + total.lines);
    console.log();

    console.log("  misc");
    console.log("    lib/test (loc)    " + (lib.loc / test.loc).toFixed(2));
    console.log("    comments/space    " + (total.lines - total.loc));
    console.log();
};

