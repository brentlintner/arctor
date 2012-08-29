describe("utils ->", function () {
    var utils = require('./../../lib/utils'),
        fs = require('fs'),
        sinon_fixture = require('./../fixtures/sinon'), sinon,
        fake_target_directory = "dir",
        fake_target_jsfile = "file.js",
        fake_target_directory_files = ["a.js", "b.js", "c.js"],
        collected_files;

    sinon_fixture.sandbox.bind(function (sandbox) { sinon = sandbox });

    describe("log", function () {
        it("maps to console.log", function () {
            utils.log.should.eql(console.log)
        })
    });

    describe("collect", function () {
        it("handles a target that is a file", function () {
            sinon.stub(fs, 'statSync')
                 .withArgs(fake_target_jsfile)
                 .returns({isDirectory: function () { return false }});

            collected_files = utils.collect(fake_target_jsfile);

            fs.statSync.should.have.been.calledOnce;
            collected_files.should.eql([fake_target_jsfile])
        });

        it("handles collecting files from within a directory", function () {
            sinon.stub(fs, 'statSync')
                 .returns({isDirectory: function () { return false }})
                 .withArgs(fake_target_directory)
                 .returns({isDirectory: function () { return true }});

            sinon.stub(fs, 'readdirSync')
                 .withArgs(fake_target_directory)
                 .returns(fake_target_directory_files);

            collected_files = utils.collect(fake_target_directory);

            collected_files
                .should.eql(fake_target_directory_files
                                .map(function (name) {return fake_target_directory + "/" + name}))
        })
    })
})
