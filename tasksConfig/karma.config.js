// Configurazione per Karma, coverage report su unit test jasmine
module.exports = (config) => {
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const serverPort = pkg.localserver.port;
    const localhostUrl = `${pkg.localserver.url}:${serverPort}`;

    config.set({
        basePath: '../',
        frameworks: ['jasmine'],
        files: [
            'node_modules/axe-core/axe.js', // A11y accessibility testing library
            'dev/agid-spid-enter.min.js', // Modulo minifizzato da testare
            'src/test/agid-*.js' // File specs
        ],
        proxies: {
            '/src/': `${localhostUrl}/src/`,
            '/img/': `${localhostUrl}/img/`
        },
        browsers: ['Chrome'],
        singleRun: true,
        reporters: ['progress', 'coverage'],
        port: 9876,
        preprocessors: {
            'dev/agid-spid-enter.min.js': ['coverage'] // modulo su cui effettuare la coverage
        },
        coverageReporter: {
            instrumenterOptions: {
                istanbul: { noCompact: true }
            },
            type: 'html',
            dir: 'reports/coverage/',
            subdir: '.'
        }
    });
};
