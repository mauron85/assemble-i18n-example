/*
 * Generated on 2014-07-21
 * generator-assemble v0.4.13
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2014 Hariadi Hinta
 * Licensed under the MIT license.
 */

'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  var fs = require('fs');
  var path = require('path');

  // Project configuration.
  grunt.initConfig({

    config: {
      src: 'src',
      tmp: '.tmp',
      dist: 'dist',
      assets: 'src/assets'
    },

    watch: {
      assemble: {
        files: ['<%= config.src %>/{content,data,templates}/{,*/}*.{md,hbs,yml,json}'],
        tasks: ['assemble']
      },
      less: {
        files: ['<%= config.assets %>/less/{,*/}*.less'],
        tasks: ['less']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.tmp %>/{,*/}*.html',
          '<%= config.tmp %>/assets/{,*/}*.css',
          '<%= config.tmp %>/assets/{,*/}*.js',
          '<%= config.tmp %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: false,
          base: [
            '<%= config.tmp %>'
          ]
        }
      }
    },

    assemble: {
      options: {
        flatten: true,
        data: '<%= config.src %>/data/**/*.{json,yml}',
        partials: '<%= config.src %>/templates/partials/*.hbs',
        layoutdir: '<%= config.src %>/templates/layouts',
        assets: '<%= config.tmp %>/assets',
        layout: 'agency.hbs'
      },
      // pages: {
      //   options: {
      //     language: 'en',
      //     plugins: ['assemble-contrib-permalinks','assemble-contrib-sitemap'],
      //     pagesx: [
      //       {data: {title: 'Home' }, content: '{{<%= config.src %>/templates/pages/index.hbs}}' },
      //       {data: {title: 'Blog' }, content: '{{<%= config.src %>/templates/pages/blog.hbs}}' }
      //     ],
      //     collections: [{
      //       title: 'pages',
      //       sortby: 'title',
      //       sortorder: 'desc'
      //     }],
      //   },
      //   files: {
      //     '<%= config.dist %>/': ['<%= config.src %>/templates/pages/*.hbs']
      //   }
      //   // dest: '<%= config.dist %>/'
      // },
      pages: {
        options: {
          plugins: ['handlebars-helper-compose', 'assemble-contrib-i18n', 'assemble-contrib-permalinks'],
          i18n: {
            data: ['<%= config.src %>/data/i18n.json', '<%= config.src %>/data/i18n/*.json'],
            templates: ['<%= config.src %>/templates/pages/*.hbs']
          },
          // languages: Object.keys(data.languages),
          permalinks: {
            stripnumber: true,
            structure: ':language/:mybasename.html',
            patterns: [{
              pattern: ':mybasename',
              replacement: function() {
                var basename = this.basename.split('-')[0];
                return basename;
              }
            }]
          }
        },
        files: [{
          src: '!*.*',
          dest: '<%= config.tmp %>/'
        }]
      }
    },

    htmlmin: { // Task
      dist: { // Target
        options: { // Target options
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.tmp %>',
          src: '**/*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    copy: {
      prepare: {
        files: [{
          expand: true,
          dot: false,
          cwd: '<%= config.assets %>',
          src: ['**/*'],
          dest: '<%= config.tmp %>/assets'
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: false,
          cwd: '<%= config.tmp %>/assets',
          src: ['**/*'],
          dest: '<%= config.dist %>/assets',
          filter: function(filepath) {
            var ext = path.extname(filepath);
            if (ext === '.gz') {
              var size = fs.statSync(filepath.substr(0, filepath.lastIndexOf('.'))).size;
              var gzipSize = fs.statSync(filepath).size;
              // @see https://developers.google.com/speed/docs/best-practices/payload#GzipCompression
              if (size <= gzipSize) {
                grunt.log.writeln('Skipping %s (size:%db < gzip:%db)', path.basename(filepath), size, gzipSize);
                return false; //skipping gzipped is larger than normal
              }
            }
            return true;
          }
        }]
      }
    },

    less: {
      dist: {
        files: {
          '<%= config.tmp %>/assets/css/agency.css': '<%= config.assets %>/less/agency.less',
          '<%= config.tmp %>/assets/css/excuse.css': '<%= config.assets %>/less/excuse.less'
        }
      }
    },

    compress: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: ['{,*}/*.html'],
          dest: '<%= config.dist %>',
          extDot: 'last',
          ext: '.html.gz',
        }, {
          expand: true,
          cwd: '<%= config.assets %>',
          src: ['**/*.js'],
          dest: '<%= config.tmp %>/assets',
          extDot: 'last',
          ext: '.js.gz'
        }, {
          expand: true,
          cwd: '<%= config.assets %>',
          src: ['**/*.css'],
          dest: '<%= config.tmp %>/assets',
          extDot: 'last',
          ext: '.css.gz'
        }],
        options: {
          mode: 'gzip',
          level: 9
        }
      }
    },

    // Before generating any new files,
    // remove any previously-created files except maintenance.html.
    clean: {
      dist: {
        files: {
          src: [
            '<%= config.tmp %>/*',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/maintenance.html',
            '!<%= config.dist %>/50x.html',
            '!<%= config.dist %>/404.html',
            '!<%= config.dist %>/robots.txt'
          ]
        }
      }
    }

  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('server', [
    'clean',
    'less',
    'copy:prepare',
    'assemble',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'less',
    'copy:prepare',
    'assemble',
    'htmlmin',
    'compress',
    'copy:dist'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};