desc('runs both jshint and csslint');
task('lint', ['lint:js', 'lint:css']);

namespace('lint', function () {
    desc('runs jshint');
    task('js', require('./tasks/lint/js'), true);
});

desc('runs test:node - usage: jake test[mocha_reporter]');
task('test', require('./tasks/test/node'), true);

namespace('test', function () {
    desc('runs all tests (in node)');
    task('node', require('./tasks/test/node'), true);

    desc('runs all tests (in node) with code coverage');
    task('cov', require('./tasks/test/cov'), true)
});

desc('displays some code base stats');
task('stats', require('./tasks/stats'));
