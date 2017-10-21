module.exports = function (grunt) {
    var serverPort     = 9000,
        localhostUrl   = 'http://localhost:' + serverPort,
        localhostIndex = localhostUrl + '/index.html';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            files: ['src/scss/*', 'src/js/*'],
            tasks: ['build', 'jasmine:agidSpid:build']
        },

        // Code style linting
        eslint: {
            target: ['src/js/*', 'test/*.js']
        },

        // Stylesheets minify
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    // 'destination': 'source'
                    // imports and dependecies defined in the SCSS file
                    'css/agid-spid-enter.min.css': 'src/scss/agid-spid-enter.scss',
                    'css/agid-spid-demo-page.css': 'src/scss/agid-spid-demo-page.scss'
                }
            }
        },

        // JavaScript minify
        uglify: {
            development: {
                options: {
                    mangle: false,
                    beautify: true,
                    compress: false
                },
                files: {
                    'js/agid-spid-enter.min.js': [
                        'src/js/agid-spid-enter.js',
                        'src/js/agid-spid-enter-tpl.js',
                        'src/js/agid-spid-enter-i18n.js',
                        'src/js/agid-spid-enter-config-dev.js'
                    ]
                }
            },
            distribution: {
                options: {
                    mangle: true,
                    beautify: false,
                    compress: {
                        drop_console: false
                    }
                },
                files: {
                    'dist/agid-spid-enter.min.js': [
                        'src/js/agid-spid-enter.js',
                        'src/js/agid-spid-enter-tpl.js',
                        'src/js/agid-spid-enter-i18n.js',
                        'src/js/agid-spid-enter-config.js'
                    ]
                }
            }
        },

        // Unit tests
        jasmine: {
            agidSpid: {
                src: [
                    'node_modules/promise-polyfill/promise.min.js', // Fix per phantomJs che non supporta Promise ES6
                    'js/agid-spid-enter.min.js'],
                options: {
                    specs: ['src/test/*.js'],
                    outfile: '_SpecRunner.html',
                    keepRunner: true,
                    host: localhostUrl
                }
            }
        },

        // Localhost server per sviluppo e test di accessibilità
        serve: {
            options: {
                port: serverPort
            }
        },

        // Test di accessibilità del componente
        // avviare prima grunt serve
        a11y: {
            agidSpidButton: {
                options: {
                    urls: [localhostIndex],
                    failOnError: true
                }
            }
        },
        "axe-webdriver": {
            chrome: {
                options: {
                    browser: "chrome"
                },
                urls: [localhostIndex]
            }
        }
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('css', ['sass']);
    grunt.registerTask('js', ['uglify']);
    grunt.registerTask('build', ['css', 'js']);
    grunt.registerTask('test', ['jasmine', 'a11y', 'axe-webdriver']);
};
