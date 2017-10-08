module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
          files: ['src/scss/*', 'src/js/*'],
          tasks: ['build', 'jasmine:agidSpid:build']
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
            options: {
                // mangle prevent changes to your variable and function names, must be false
                mangle: false,
                // beautify should be true for debug
                beautify: true,
                compress: {
                    //set false for debug
                    drop_console: false
                }
            },
            my_target: {
                files: {
                    'js/agid-spid-enter.min.js': [
                        'src/js/agid-spid-enter-config.js',
                        'src/js/agid-spid-enter-tpl.js',
                        'src/js/agid-spid-enter.js'
                    ]
                }
            }
        },

        // Unit tests
        jasmine: {
            agidSpid: {
                src: 'src/js/*.js',
                options: {
                    specs: 'src/test/*.js',
                    outfile: '_SpecRunner.html'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('css', ['sass']);
    grunt.registerTask('js', ['uglify']);
    grunt.registerTask('build', ['css','js']);
};
