module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
          files: ['src/js/*','src/scss/*'],
          tasks: ['build']
        },

        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    // 'destination': 'source'
                    'css/agid-spid-enter.min.css': 'src/scss/agid-spid-enter.scss'
                }
            }
        },

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
                        'src/js/agid-spid-enter.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('css', ['sass']);
    grunt.registerTask('js', ['uglify']);
    grunt.registerTask('build', ['css','js']);
};
