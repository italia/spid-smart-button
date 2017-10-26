module.exports = function (grunt) {
    var serverPort     = 9000,
        localhostUrl   = 'http://localhost:' + serverPort,
        localhostIndex = localhostUrl + '/index.html';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            files: ['src/scss/*', 'src/js/*'],
            tasks: ['build', 'jasmine']
        },

        // SCSS code style linting
        stylelint: {
            src: [
                'src/scss/*'
            ]
        },

        // JS code style linting
        eslint: {
            target: ['src/js/*', 'test/*.js', '!src/js/*-tpl.js']
        },

        // Stylesheets minify
        sass: {
            // 'destination': 'source'
            // imports and dependecies defined in the SCSS file
            development: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'css/agid-spid-enter.min.css': [
                        'src/scss/agid-spid-enter-dev.scss'
                    ]
                }
            },
            production: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    'prod/agid-spid-enter.min.css': [
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
                src: 'css/agid-spid-enter.min.css',
                dest: 'css/agid-spid-enter.min.css'
            },
            production: {
                options: {
                    map: false
                },
                src: 'prod/agid-spid-enter.min.css',
                dest: 'prod/agid-spid-enter.min.css'
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
            production: {
                options: {
                    mangle: true,
                    beautify: false,
                    compress: {
                        drop_console: false
                    }
                },
                files: {
                    'prod/agid-spid-enter.min.js': [
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
                    'node_modules/promise-polyfill/promise.min.js', // Fix per phantomJs che non supporta Promise ES6
                    'node_modules/axe-core/axe.js', // A11y accessibility testing library
                    'js/agid-spid-enter.min.js'], // Modulo minifizzato da testare
                options: {
                    specs: ['src/test/*.js'],
                    outfile: '_SpecRunner.html',
                    keepRunner: true,
                    host: localhostUrl
                }
            }
        },

        // Localhost server per sviluppo
        serve: {
            options: {
                port: serverPort
            }
        }
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('css', ['sass', 'postcss']);
    grunt.registerTask('js', ['uglify']);
    grunt.registerTask('lint', ['stylelint', 'eslint']);
    grunt.registerTask('build', ['css', 'js']);
    grunt.registerTask('test', ['jasmine']);
};
