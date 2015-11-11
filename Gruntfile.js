module.exports = function(grunt) {
    // Custom config
    var config = {
        'less' : {
            'files' : [
                'src/less/common.less',
                'src/less/variables.less',
                'src/less/common/**/*.less',
                'src/less/parts/**/*.less',
                'src/less/layouts/**/*.less',
                'src/less/components/**/*.less',
                'src/less/template.less',
                '!src/less/index.less'
            ]
        },
        'magpieui' : {
            'name' : 'MagpieUI',
            'path' : 'bower_components/magpieui/build/'
        }
    };
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    // Display how match time it took to build each task
    require('time-grunt')(grunt);
    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),

        clean : {
            options : {
                force : true
            },
            build : [
                'build'
            ],
            'images' : [
                'build/img'
            ],
            post : [
                'temp'
            ]
        },

        bower : {
            install : {
                cleanup : false,
                copy : false,
                install : true
            }
        },

        less_imports: {
            source: {
                options: {
                    banner: '/* ************ APP UI: IMPORT ************ */'
                },
                src: [
                    config['magpieui']['path'] + 'less/' + config['magpieui']['name'] + '.less',
                    config['less']['files']
                ],
                dest: 'src/less/index.less'
            }
        },

        less : {
            build : {
                src : ['src/less/index.less'],
                dest : 'temp/build.css'
            }
        },

        concat: {
            build_scripts: {
                src: [
                    config['magpieui']['path'] + 'js/' + config['magpieui']['name'] + '.js',
                    'src/js/application.js',
                    'src/js/components/**/*.js',
                    'src/js/components.js'
                ],
                dest: 'build/js/<%= pkg.name %>.js'
            },
            build_styles: {
                src: [
                    'src/css/**/*.css',
                    'temp/build.css'
                ],
                dest: 'build/css/<%= pkg.name %>.css'
            }
        },

        cssmin : {
            build : {
                files : {
                    'build/css/<%= pkg.name %>.min.css' : 'build/css/<%= pkg.name %>.css'
                }
            }
        },

        uglify : {
            build : {
                src : 'build/js/<%= pkg.name %>.js',
                dest : 'build/js/<%= pkg.name %>.min.js'
            }
        },

        imagemin: {
            build: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: 'src/img/',
                    src: ['**/*.*'],
                    dest: 'build/img/'
                }]
            }
        },

        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: config['magpieui']['path'] + 'img/',
                    src: ['**/*.*'],
                    dest: 'build/img/magpieui/'
                },{
                    expand: true,
                    cwd: config['magpieui']['path'] + 'fonts/',
                    src: ['**/*.*'],
                    dest: 'build/fonts/magpieui/'
                },{
                    expand: true,
                    cwd: 'src/',
                    src: ['*.*'],
                    dest: 'build/'
                },{
                    expand: true,
                    cwd: 'src/fonts/',
                    src: [
                        '**/*.*',
                        '!**/*.json'
                    ],
                    dest: 'build/fonts/'
                }]
            }
        },

        watch: {
            development: {
                files: [
                    'src/*.*',
                    'src/js/**/*.js',
                    'src/css/**/*.css',
                    'src/less/**/*.less',
                    'src/tpl/**/*.*'
                ],
                tasks: ['dev'],
                options: {
                    spawn: false
                }
            },
            images: {
                files: ['src/img/**/*.*'],
                tasks: ['images'],
                options: {
                    spawn: false
                }
            }
        }
    });
    // Default task(s).
    grunt.registerTask('default', ['clean', 'bower', 'less_imports', 'less', 'concat', 'cssmin', 'uglify', 'imagemin', 'copy', 'clean:post']);
    grunt.registerTask('dev', ['less_imports', 'less', 'concat', 'copy', 'clean:post']);
    grunt.registerTask('images', ['clean:images', 'imagemin']);
};