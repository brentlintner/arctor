var sinon = require('sinon'),
    chai = require('chai'),
    sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chai.should);

module.exports = {
    sandbox: {
        bind: function (callback) {
            var sandbox;

            beforeEach(function () {
                sandbox = sinon.sandbox.create();
                callback(sandbox)
            });

            afterEach(function () {
                sandbox.verifyAndRestore()
            });
        }
    }
};
