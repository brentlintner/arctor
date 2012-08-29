describe('cli ->', function () {
    var path = require('path'),
        cli = require('cli'),
        fs = require('fs'),
        my_cli = require('./../../lib/cli'),
        utils = require('./../../lib/utils'),
        conf = require('./../../lib/conf'),
        scanner = require('./../../lib/scanner'),
        graph = require('./../../lib/graph'),
        sinon_fixture = require('./../fixtures/sinon'), sinon,
        base_argv,
        fake_version,
        fake_targets;

    sinon_fixture.sandbox.bind(function (sandbox) { sinon = sandbox });

    beforeEach(function () {
        base_argv = ['node', '$0'];
        fake_targets = ["a", "b", "c"];
        fake_version = "x.x.x";
        cli.args = [];
        cli.version = fake_version;

        sinon.stub(scanner, 'search');
        sinon.stub(utils, 'log');
        sinon.stub(graph, 'create');
        sinon.stub(cli, 'setArgv');
        sinon.stub(cli, 'setApp');
        sinon.stub(cli, 'getUsage')
        sinon.stub(cli, 'parse');
    });

    afterEach(function () {
        cli.args = undefined;
        cli.version = undefined;
    });

    describe("interpreting args", function () {
        it("sets the usage", function () {
            cli.parse.returns({});
            my_cli.interpret(base_argv);
            cli.parse.should.have.been.calledWith(conf.cli.usage)
        });

        it("passes argv to the cli module", function () {
            cli.parse.returns({});
            my_cli.interpret(base_argv);
            cli.setArgv.should.have.been.calledWithExactly(base_argv)
        });

        describe("displaying the usage", function () {
            afterEach(function () {
                cli.getUsage.should.have.been.called
            });

            it("happens when zero targets are given", function () {
                cli.parse.returns({});
                my_cli.interpret(base_argv);
            })

            it("happens when the `help` option is set", function () {
                cli.parse.returns({'help': true});
                my_cli.interpret(base_argv.concat(["--help"])); // redundant to test with `-h`
            });
        });

        describe("when the `version` option is set", function () {
            beforeEach(function () {
                cli.parse.returns({'version': true});
                my_cli.interpret(base_argv.concat(["--version"])); // redundant to test with `-v`
            });

            it("logs the app's version to console", function () {
                cli.setApp.should.have.been.calledWith(path.join(conf.root, 'package.json'));
                utils.log.should.have.been.calledWith(fake_version)
            });
        });

        describe("scanning targets", function () {
            var deps, callback;

            beforeEach(function () {
                cli.parse.returns({})
                cli.args = fake_targets;
                deps = {data: "obj"}
            });

            it("are passed in via the cli's ARGS", function () {
                my_cli.interpret(base_argv.concat(fake_targets));
                scanner.search.args[0][0].should.equal(fake_targets)
            });

            describe("by default", function () {
                it("dumps the result of the scan to the console", function () {
                    my_cli.interpret(base_argv.concat(fake_targets))

                    callback = scanner.search.args[0][2];
                    callback(null, deps);

                    utils.log.should.have.been.calledWith(JSON.stringify(deps))
                });
            });

            describe("when the `output` option is set", function () {
                it("attempts to write the data to the specified path", function () {
                    var some_file_path = "foo/bar";

                    sinon.stub(fs, 'writeFileSync');
                    cli.parse.returns({output: some_file_path});

                    my_cli.interpret(base_argv.concat(fake_targets).concat(["--output", some_file_path]));
                    callback = scanner.search.args[0][2];
                    callback(null, deps);

                    fs.writeFileSync
                      .should.have.been
                      .calledWithExactly(path.resolve(process.cwd(), some_file_path), JSON.stringify(deps), 'utf-8')
                });
            });

            describe("when the `graph` option is set", function () {
                beforeEach(function () {
                    cli.parse.returns({graph: true});
                });

                it("boots a graph server", function () {
                    var deps_js = "var deps = " + JSON.stringify(deps) + ";";

                    my_cli.interpret(base_argv.concat(fake_targets).concat(["--graph"]))

                    callback = scanner.search.args[0][2];
                    callback(null, deps);

                    graph.create.should.have.been.calledWith(deps_js)
                });
            })
        });
    })
})
