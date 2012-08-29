var fs = require('fs'),
    resultsFile = __dirname + '/../../assets/cov/results.html';

process.on('exit', function () {
    var HTMLReporter = require('./../../node_modules/coverjs/lib/reporters/HTMLReporter'),
        html = new HTMLReporter(global.__$coverObject),
        report = html.report(),
        coverage_percent = Math.round((html.pass / html.total) * 100);

    report = report.replace(/<body>/g,
                            '<body>' +
                               '<div class="totals">' +
                                 '<div class="total-coverage">' + coverage_percent + "% coverage</div>" +
                                 '<div class="total-statements">' + html.total + " statements</div>" +
                                 '<div class="total-covered">' + html.pass + " covered</div>" +
                                 '<div class="total-skipped">' + html.error + " skipped</div>" +
                               '</div>');

    fs.writeFileSync(resultsFile, report, 'utf-8');

    console.log('  total coverage      ' + coverage_percent + '%');
    console.log();
    console.log('  statements          ' + html.total);
    console.log('    covered           ' + html.pass);
    console.log('    skipped           ' + html.error);
    console.log();
});
