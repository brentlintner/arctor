describe('graph ->', function () {
    var connect = require('connect'),
        path = require('path'),
        graph = require('./../../../lib/node/graph'),
        utils = require('./../../../lib/node/utils'),
        conf = require('./../../../lib/node/conf'),
        sinon_fixture = require('./../../fixtures/sinon'), sinon,
        connect_server,
        connect_static,
        orig_static_method;

    sinon_fixture.sandbox.bind(function (sandbox) { sinon = sandbox });

    beforeEach(function () {
        connect_server = {
            use: function () { return connect_server },
            listen: function () { return connect_server }
        };

        orig_static_method = connect.static;
        connect.__defineGetter__('static', function () { return connect_static });
    });

    afterEach(function () {
        connect.__defineGetter__('static', function () { return orig_static_method });
        connect.__defineSetter__('static', function () {});
    });

    describe("booting a web server for visual graphing of dependencies", function () {
        beforeEach(function () {
            connect_static = sinon.stub().returnsArg(0);

            sinon.spy(connect_server, 'use');
            sinon.spy(connect_server, 'listen');
            sinon.stub(connect, 'createServer')
                 .returns(connect_server);
        });

        it("listens on the appropriate port and notifies the user when ready", function () {
            sinon.stub(utils, 'log')

            graph.create();

            connect_server
                .listen
                .should.have.been.calledWith(conf.ports.graph);

            var serverReady = connect_server.listen.args[0][1];

            serverReady();

            utils.log.args[0][0].should.match(new RegExp(conf.ports.graph));
        });

        it("registers any needed (static) assets", function () {
            var static_graphing_assets = ["lib", "assets/graph", "deps"];

            graph.create();

            static_graphing_assets.forEach(function (item) {
                connect
                    .static
                    .should.have.been.calledWith(path.join(conf.root, item))
            });
        });

        describe("when serving up the dependencies data file", function () {
            it("maps it to /deps.js", function () {
                graph.create();

                connect_server
                    .use
                    .should.have.been.calledWith('/deps.js')
            });

            it("replies with an appropriate response", function () {
                var res = {
                        writeHead: sinon.spy(),
                        end: sinon.spy()
                    },
                    deps = "var some_name = data_object;",
                    response_headers = {"Content-Type": connect.mime.types.js},
                    depsjs_middleware_invoked;

                graph.create(deps);

                depsjs_middleware_invoked = connect_server.use.args[0][1]; // presuming it is first .use call

                depsjs_middleware_invoked(null, res, null);

                res.writeHead.should.have.been.calledWithExactly(response_headers);
                res.end.should.have.been.calledWithExactly(deps);
            });
        })
    });
})
