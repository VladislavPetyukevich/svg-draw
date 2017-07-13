module.exports = function (grunt) {
	var hostname = 'localhost';
	var port = 8000;
	var pathToOpen = (grunt.option('test')) ? '/tests/' : '/examples/';
	grunt.initConfig({
		concat: {
			options: {
				separator: ';',
			},
			dist: {
				src: ['module_template/beginFile.js', 'src/**/*.js', 'module_template/endFile.js'],
				dest: 'build/svgEditor.js',
			},
		},

		uglify: {
			build: {
				src: 'build/svgEditor.js',
				dest: 'build/svgEditor.min.js'
			}
		},
		watch: {
			options: {
				livereload: true,
			},
			scripts: {
				files: ['src/**/*.js', 'examples/*.html', 'examples/*.css', 'examples/*.js', 'tests/*.js', 'tests/*html'],
				options: {
					spawn: false,
				},
			}
		},

		connect: {
			test: {
				options: {
					hostname: hostname,
					port: port,
					open: 'http://' + hostname + ':' + port + pathToOpen,
					base: '.'
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('build', ['concat', 'uglify']);
	grunt.registerTask('server', ['connect', 'watch']);
}