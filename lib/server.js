var connect = require('connect');

module.exports = {
    boot: function (deps) {
        connect(
            connect.router(function (app) {
                app.get('/deps.js', function (req, res, next) {
                    res.writeHead({"Content-Type": "application/javascript"});
                    res.end(deps);
                });
            }),
            connect.static(__dirname + '/../lib'),
            connect.static(__dirname + '/../assets'),
            connect.static(__dirname + '/../deps')
        ).listen(8080, function () {
            process.stdout.write("listening on: http://127.0.0.1:8080\n");
        });
    }
};
