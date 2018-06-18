module.exports = function (grunt) {
    var fs = require('fs'),
        pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8')),
        serverPort = pkg.localserver.port,
        localhostUrl = pkg.localserver.url + serverPort;

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        watch: {
            build: {
                files: ['src/scss/*', 'src/js/*'],
                tasks: ['build']
            },

            test: {
                files: ['src/scss/*', 'src/js/*'],
                tasks: ['build', 'jasmine']
            }
        },

        // Controllo di sicurezza, rileva vulnerabilità note nel codice e nelle dipendenze
        retire: {
            js: ['src/js/*'],
            node: ['.'],
            options: {
                outputFile: 'reports/retire.json'
            }
        },

        // SCSS code style linting
        stylelint: {
            src: [
                'src/scss/*'
            ],
            options: {
                outputFile: 'reports/stylelint.log'
            }
        },

        // JS code style linting
        eslint: {
            target: ['src/js/*', 'test/*.js', '!src/js/*-tpl.js'],
            options: {
                outputFile: 'reports/eslint.log'
            }
        },

        // Stylesheets minify
        sass: {
            // imports and dependecies defined in the SCSS file
            dev: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dev/agid-spid-enter.min.css': 'src/scss/agid-spid-enter-dev.scss'
                }
            },
            prod: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    'dist/agid-spid-enter.min.<%= pkg.version %>.css': 'src/scss/agid-spid-enter-prod.scss'
                }
            }
        },

        // Processa i CSS prodotti da sass e aggiunge vendor prefix sulle proprietà per browser obsoleti
        postcss: {
            options: {
                failOnError: true,
                processors: [
                    require('autoprefixer')()
                ]
            },
            dev: {
                options: {
                    map: true
                },
                src: 'dev/agid-spid-enter.min.css',
                dest: 'dev/agid-spid-enter.min.css'
            },
            prod: {
                options: {
                    map: false
                },
                src: 'dist/agid-spid-enter.min.<%= pkg.version %>.css',
                dest: 'dist/agid-spid-enter.min.<%= pkg.version %>.css'
            }
        },

        // JavaScript minify
        uglify: {
            dev: {
                options: {
                    mangle: false,
                    beautify: true,
                    compress: false
                },
                files: {
                    'dev/agid-spid-enter.min.js': [
                        'src/js/agid-spid-enter.js',
                        'src/js/agid-spid-enter-tpl.js',
                        'src/js/agid-spid-enter-config-dev.js'
                    ]
                }
            },
            prod: {
                options: {
                    mangle: true,
                    beautify: false,
                    compress: {
                        drop_console: false
                    }
                },
                files: {
                    'dist/agid-spid-enter.min.<%= pkg.version %>.js': [
                        'src/js/agid-spid-enter.js',
                        'src/js/agid-spid-enter-tpl.js',
                        'src/js/agid-spid-enter-config.js'
                    ],
                    'dist/agid-spid-enter.min.latest.js': [
                        'src/js/agid-spid-enter.js',
                        'src/js/agid-spid-enter-tpl.js',
                        'src/js/agid-spid-enter-config.js'
                    ]
                }
            }
        },

        // Unit tests
        jasmine: {
            unitTest: {
                src: [
                    'node_modules/promise-polyfill/promise.min.js', // Fix per phantomJs che non supporta Promise ES6
                    'node_modules/axe-core/axe.js', // A11y accessibility testing library
                    'dev/agid-spid-enter.min.js' // Modulo minifizzato da testare
                ],
                options: {
                    specs: ['src/test/agid-*.js'],
                    outfile: '_SpecRunner.html',
                    keepRunner: true,
                    host: localhostUrl
                }
            }
        },

        'string-replace': {
            version: {
                files: {
                    'dev/': ['dev/agid-spid-enter.min.js'],
                    'dist/': [
                        'dist/agid-spid-enter.min.<%= pkg.version %>.js',
                        'dist/agid-spid-enter.min.latest.js'
                    ]
                },
                options: {
                    replacements: [{
                        pattern: /{{ VERSION }}/g,
                        replacement: '<%= pkg.version %>'
                    }]
                }
            }
        },

        // Localhost server per sviluppo e unit test
        serve: {
            options: {
                port: serverPort
            }
        }
    });

    grunt.registerTask('log-jasmine', function () {
        grunt.log.writeln('La pagina specrunner di jasmine si trova in:');
        grunt.log.writeln(localhostUrl + '/_SpecRunner.html');
    });

    grunt.registerTask('log-coverage', function () {
        grunt.log.writeln('Il report della code coverage si trova in:');
        grunt.log.writeln(localhostUrl + '/reports/coverage/dev/agid-spid-enter.min.js.html');
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('css', ['sass:dev', 'postcss:dev']);
    grunt.registerTask('js', ['uglify', 'string-replace']);
    grunt.registerTask('lint', ['stylelint', 'eslint']);
    grunt.registerTask('build', ['css', 'js']);
    grunt.registerTask('test', ['jasmine', 'log-jasmine']);
};
