
module.exports = function (grunt) {
    var fs = require('fs'),
    pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8')),
    serverPort = pkg.localserver.port,
    localhostUrl = pkg.localserver.url + serverPort;
    
    const sass = require('node-sass');
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        watch: {
            build: {
                files: ['src/scss/*', 'src/js/*', 'src/data/*'],
                tasks: ['build:dev']
            },

            test: {
                files: ['src/scss/*', 'src/js/*'],
                tasks: ['build:dev', 'jasmine']
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
                    implementation: sass,
                    style: 'expanded'
                },
                files: {
                    'dist/spid-button.min.css': 'src/scss/spid-button-dev.scss'
                }
            },
            prod: {
                options: {
                    implementation: sass,
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    'dist/spid-button.min.css': 'src/scss/spid-button-prod.scss'
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
                src: 'dist/spid-button.min.css',
                dest: 'dist/spid-button.min.css'
            },
            prod: {
                options: {
                    map: false
                },
                src: 'dist/spid-button.min.css',
                dest: 'dist/spid-button.min.css'
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
                    'dist/spid-button.min.js': [
                        'src/js/spid-button.js',
                        'src/js/i18n.js',
                        'src/js/providers.js',
                        'src/js/config-dev.js'
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
                    'dist/spid-button.min.js': [
                        'src/js/spid-button.js',
                        'src/js/i18n.js',
                        'src/js/providers.js',
                        'src/js/config.js'
                    ]
                }
            }
        },
        copy: {
            prod: {
                files: [
                    // includes files within path
                    { expand: true, src: ['img/**'], dest: 'dist/', filter: 'isFile' }
                ],
            },
        },

        // Unit tests
        jasmine: {
            unitTest: {
                src: [
                    'node_modules/axe-core/axe.js', // A11y accessibility testing library
                    'dist/spid-button.min.js' // Modulo minifizzato da testare
                ],
                options: {
                    specs: ['src/test/spid-button-*.js'],
                    outfile: '_SpecRunner.html',
                    keepRunner: true,
                    host: localhostUrl
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
        grunt.log.writeln(localhostUrl + '/reports/coverage/distv/spid-button.min.js.html');
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('lint', ['stylelint', 'eslint']);
    grunt.registerTask('build:prod', ['sass:prod', 'postcss:prod', 'copy:prod', 'uglify:prod']);
    grunt.registerTask('build:dev', ['sass:dev', 'postcss:dev', 'uglify:dev']);
    grunt.registerTask('test', ['jasmine', 'log-jasmine']);
};
