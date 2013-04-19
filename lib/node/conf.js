var path = require('path');

module.exports = {
    root: path.join(__dirname, "..", ".."),

    ports: {
        graph: 6001
    },

    regex: {
        jsfile: /\.js$/,
        relative_prefix: /^\.\//,
        relative_require: /^(\.\/)?(\.\.\/)*/
    },

    cli: {
        usage: {
            "output":  [
                "o", "file to output to, else output to stdout", "string"
            ],
            "graph":  [
                "g", "display a visual graph of dependencies"
            ],
            "version":  [
                "version", "display package version"
            ],
            "help":  [
                "h", "egads!?"
            ]

        }
    }
};
