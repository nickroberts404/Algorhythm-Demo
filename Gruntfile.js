module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			// options: {
			// 	separator: ';',
			// },
			js: {
				src: ['src/js/main.js','src/js/graphModule/graphDisplay.js','src/js/graphModule/graphController.js','src/js/gridModule/gridDisplay.js','src/js/gridModule/gridController.js','src/js/pointModule/pointDisplay.js','src/js/pointModule/pointController.js'],
				dest: 'dist/js/app.js'
			},
			algorhythm: {
				src: ['src/js/lib/algorhythm/data-structures/*.js', 'src/js/lib/algorhythm/algorithms/*.js'],
				dest: 'dist/js/algorhythm.js'
			}
		},
	watch: {
		js: {
			files: ['src/js/**/*.js'],
			tasks: ['concat']
		},
		css: {
			files: ['src/css/**/*.scss'],
			tasks: ['sass']
		},
	},
	sass: {
		options: {
			noCache: true
		},
		dist: {
			files: {
				'dist/css/main.css': 'src/css/main.scss'
			}
		}
	}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.registerTask('default', ['concat', 'watch', 'sass']);

}