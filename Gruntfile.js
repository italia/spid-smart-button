module.exports = (grunt) => {
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const serverPort = pkg.localserver.port;
    const localhostUrl = `${pkg.localserver.url}:${serverPort}`;
    const sass = require('node-sass');

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            files: ['src/scss/*', 'src/js/*'],
            tasks: ['build', 'jasmine']
        },

        // Compila file di produzione per ES5
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/agid-spid-enter.min.<%= pkg.version %>.js': 'dist/agid-spid-enter.min.<%= pkg.version %>.js',
                    'dist/agid-spid-enter.min.latest.js': 'dist/agid-spid-enter.min.latest.js',
                    'dev/agid-spid-enter.min.js': 'dev/agid-spid-enter.min.js'
                }
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
            target: ['src/js/*', 'test/*.js']
        },

        // Stylesheets minify
        sass: {
            // 'destination': 'source'
            // imports and dependecies defined in the SCSS file
            development: {
                options: {
                    implementation: sass,
                    style: 'expanded'
                },
                files: {
                    'dev/agid-spid-enter.min.css': [
                        'src/scss/agid-spid-enter-dev.scss'
                    ]
                }
            },
            production: {
                options: {
                    implementation: sass,
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    'dist/agid-spid-enter.min.<%= pkg.version %>.css': [
                        'src/scss/agid-spid-enter-prod.scss'
                    ]
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
            development: {
                options: {
                    map: true
                },
                src: 'dev/agid-spid-enter.min.css',
                dest: 'dev/agid-spid-enter.min.css'
            },
            production: {
                options: {
                    map: false
                },
                src: 'dist/agid-spid-enter.min.<%= pkg.version %>.css',
                dest: 'dist/agid-spid-enter.min.<%= pkg.version %>.css'
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
                    'dev/agid-spid-enter.min.js': [
                        'src/js/agid-spid-enter.js',
                        'src/js/agid-spid-enter-tpl.js',
                        'src/js/agid-spid-enter-i18n.js',
                        'src/js/agid-spid-enter-config-dev.js'
                    ]
                }
            },
            production: {
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
                        'src/js/agid-spid-enter-i18n.js',
                        'src/js/agid-spid-enter-config.js'
                    ],
                    'dist/agid-spid-enter.min.latest.js': [
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
            unitTest: {
                src: [
                    'node_modules/axe-core/axe.js',
                    'dev/agid-spid-enter.min.js'
                ],
                options: {
                    specs: ['src/test/agid-*.js'],
                    outfile: '_SpecRunner.html',
                    keepRunner: true,
                    host: localhostUrl,
                    display: 'short',
                    summary: true,
                    random: true
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

    grunt.registerTask('log-serve', function () {
        grunt.log.writeln('La pagina demo si trova in:');
        grunt.log.writeln(`${localhostUrl}/index.html`);
    });

    grunt.registerTask('log-jasmine', function () {
        grunt.log.writeln('La pagina specrunner di jasmine si trova in:');
        grunt.log.writeln(`${localhostUrl}/_SpecRunner.html`);
    });

    grunt.registerTask('log-coverage', function () {
        grunt.log.writeln('Il report della code coverage si trova in:');
        grunt.log.writeln(`${localhostUrl}/reports/coverage/dev/agid-spid-enter.min.js.html`);
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('css', ['sass', 'postcss']);
    grunt.registerTask('js', ['babel', 'uglify', 'string-replace']);
    grunt.registerTask('lint', ['stylelint', 'eslint']);
    grunt.registerTask('build', ['css', 'js']);
    grunt.registerTask('test', ['jasmine', 'log-jasmine']);
};
