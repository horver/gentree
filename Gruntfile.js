module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
        livereload: 7777
      },
      js: {
        files: ['js/**/*.js', 'tests/*.js', '!tests/tests.js'],
        tasks: ['clean:js', 'jshint', 'concat:js', 'uglify:js', 'copy', 'clean:tests', 'concat:tests']
      },
      css: {
        files: ['css/**/*.css', '!css/materialize-gentree.css'],
        tasks: ['clean:css', 'concat:css', 'cssmin:css', 'copy']
      },
      compass: {
        files: ['css/sass/**/*.{css,scss}', '!css/materialize-gentree.css'],
        tasks: ['clean:css', 'sass', 'concat:css', 'cssmin:css', 'copy']
      },
      html: {
        files: ['view/*.html'],
        tasks: ['clean:html', 'concat:html', 'htmlmin:html', 'copy']
      }
    },

    copy: {
      main: {
        
      }
    },

    sass: {
      css: {
        options: {
          sourcemap: false,
          noCache: true
        },
        files: {
          'css/materialize-gentree.css': 'css/sass/materialize.scss'
        }
      }
    },

    htmlmin: {
      html: {
        files: {
          'dist/main-min.html': 'dist/main.html'
        }
      }
    },

    cssmin: {
      css: {
        files: {
          'dist/css/style.min.css': 'dist/css/style.css'
        }
      }
    },

    clean: {
      js: {
        src: 'dist/js/**/*.js'
      },
      css: {
        src: 'dist/css/*.css'
      },
      html: {
        src: ['dist/main.html', 'dist/main-min.html']
      },
      tests: {
        src: 'tests/tests.js'
      }
    },

    concat: {
      js: {
        src: ['js/libs/**/*.js', 'js/components/**/*.js', 'js/*.js', '!js/components/login.js', '!js/components/register.js'],
        dest: 'dist/js/app.js'
      },
      css: {
        src: 'css/*.css',
        dest: 'dist/css/style.css'
      },
      html: {
        src: ['view/*.html', '!view/login.html', '!view/register.html'],
        dest: 'dist/main.html'
      },
      tests: {
        src: ['tests/*.js', '!tests/tests.js'],
        dest: 'tests/tests.js'
      }
    },

    jshint: {
      js: {
        ignore_warning: {
          options: {
            '-W015': true,
          },
          src: ['js/**/*.js', '!js/libs/**/*.js']
        }
      }
    },

    uglify: {
      options: {
        preserveComments: false
      },
      js: {
        src: 'dist/js/app.js',
        dest: 'dist/js/app.min.js'
      }
    }
  });

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['clean', 'jshint', 'sass', 'concat', 'cssmin', 'htmlmin', 'uglify', 'copy']);
};
