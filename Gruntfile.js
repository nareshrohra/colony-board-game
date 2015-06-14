module.exports = function(grunt) {
  var exec = require('child_process').execSync;
  var spawn = require('child_process').spawn;
			
  function execCallback(error, stdout, code) {
    console.log('execCallback called');
    if (error instanceof Error)
	  throw error;
    console.log(stdout);
  }

  var pkg = grunt.file.readJSON('package.json');	
  
  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
	clean: {
		dist: ["dist/"],
	},
    concat: {
	  js: {
		options: {
		  separator: ';'
		},
		src: ['src/client/scripts/lib/jquery/**/*.js', 'src/client/scripts/lib/*.js', 'src/client/scripts/app/**/*.js'],
		dest: 'dist/js/<%= pkg.name %>.js'
	  },
	  css: {
	    options: {
		  separator: ''
		},
		src: ['src/client/css/**/*.css'],
		dest: 'dist/css/<%= pkg.name %>.css'
	  }
	},
	uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
        }
      }
    },
	jshint: {
	  // define the files to lint
	  files: ['gruntfile.js', 'src/client/**/.js'],
	  // configure JSHint (documented at http://www.jshint.com/docs/)
	  options: {
		  // more options here if you want to override JSHint defaults
		globals: {
		  jQuery: true,
		  console: true,
		  module: true
		}
	  }
	},
	copy: {
	  html: {
		expand: true,
		src: 'src/client/index.htm',
		dest: 'dist/',
		flatten: true,
		filter: 'isFile',
		options: {
			process: function (content, srcpath) {
				var newContent = content;
				//replace js reference
				newContent = newContent.replace(/scripts\/lib\/require\/require.js/g, 'js/' + pkg.name + '.min.js');
				//replace css reference
				newContent = newContent.replace(/css\/style.css/g, 'css/' + pkg.name + '.css');
				//remove additional css references since they have been concatenated
				newContent = newContent.replace(/<link rel="stylesheet" href="css\/bootstrap\/css\/bootstrap.min.darky.css"\/>/g, '');
				return newContent;
			}
		}
	  },
	  font: {
		expand: true,
		flatten: true,
		src: 'src/client/css/bootstrap/fonts/*',
		dest: 'dist/fonts/',
		filter: 'isFile'
	  },
	  css_map: {
		expand: true,
		flatten: true,
		src: 'src/client/css/bootstrap/css/*.map',
		dest: 'dist/css/',
		filter: 'isFile'
	  }
	}
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  
  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'copy']);
  grunt.registerTask('js-update', ['jshint', 'concat:js', 'uglify']);
  grunt.registerTask('css-update', ['concat:css']);
  grunt.registerTask('html-update', ['copy:html']);
  grunt.registerTask('clean', ['clean']);
};