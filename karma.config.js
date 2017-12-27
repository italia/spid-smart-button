// Configurazione per Karma, coverage report su unit test jasmine
module.exports = function (config) {
    var fs           = require('fs'),
        pkg          = JSON.parse(fs.readFileSync('./package.json', 'utf8')),
        serverPort   = pkg.localserver.port,
        localhostUrl = pkg.localserver.url + serverPort;

    config.set({
        basePath: '.',
        frameworks: ['jasmine'],
        files: [
            'node_modules/promise-polyfill/promise.min.js', // Fix per phantomJs che non supporta Promise ES6
            'node_modules/axe-core/axe.js', // A11y accessibility testing library
            'dev/agid-spid-enter.min.js', // Modulo minifizzato da testare
            'src/test/*.js' // File specs
        ],
        proxies: {
            '/src/': localhostUrl + '/src/',
            '/img/': localhostUrl + '/img/'
        },
        browsers: ['PhantomJS'],
        singleRun: true,
        reporters: ['progress', 'coverage'],
        port: 9876,
        preprocessors: {
            "./dev/agid-spid-enter.min.js": ["coverage"] // modulo su cui effettuare la coverage
        },
        coverageReporter: {
            instrumenterOptions: {
                istanbul: { noCompact: true }
            },
            type: 'html',
            dir: 'coverage/',
            subdir: '.'
        }
    });
};
