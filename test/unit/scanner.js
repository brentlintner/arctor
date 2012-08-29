describe("scanner ->", function () {
    var scanner = require('./../../lib/scanner'),
        utils = require('./../../lib/utils'),
        sinon_fixture = require('./../fixtures/sinon'), sinon,
        fs = require('fs'),
        path = require('path'),
        fake_file = {
            name: "lib/foo.js",
            dirname: "lib",
            data: "require('a');require('./b');",
            expected_scanner_result_json: {
                "lib/foo": [
                    {
                        "external": true,
                        "path": "a"
                    }, {
                        "external": false,
                        "path": "lib/b"
                    }
                ]
            }
        },
        targets,
        scan_callback;

    sinon_fixture.sandbox.bind(function (sandbox) { sinon = sandbox });

    describe("with a JS file containing a relative and an external require statement", function () {
        it("scans a file, and returns expected json data", function () {
            scan_callback = sinon.spy();

            sinon.mock(fs)
                 .expects('readFileSync')
                 .withArgs(path.normalize(path.join(process.cwd(), fake_file.name)), "utf-8")
                 .once()
                 .returns(fake_file.data);

            sinon.mock(fs)
                 .expects('existsSync')
                 .withArgs(path.join(process.cwd(), fake_file.dirname, "b.js"))
                 .once()
                 .returns(true);

            sinon.stub(utils, 'collect')
                 .returns([fake_file.name]);

            targets = [fake_file.name];
            scanner.search(targets, null, scan_callback);
            scan_callback.should.have.been.calledWith(null, fake_file.expected_scanner_result_json)
        });
    })
});
