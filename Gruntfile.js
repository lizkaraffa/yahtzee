module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options: {
					style: 'expanded',
					lineNumbers: false
				},
				files: [{
					expand: true,
					cwd: 'scss',
					src: ['**/*.scss'],
					dest: 'css',
					ext: '.css'
				}]
			}
		},
		concat: {   
		    dist: {
		        src: [
		        	'js/setup.js',
		            'js/index.js'      
		        ],
		        dest: 'js/production.js',
		    }
		},
		jshint: {
		    all: ['Gruntfile.js', 'js/*.js']
		},
		autoprefixer: {
            dist: {
                files: {
                    'build/css/style.css': 'css/style.css'
                }
            }
        },
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass', 'autoprefixer']
			},
			scripts: {
		        files: ['js/*.js'],
		        tasks: ['concat', 'jshint'],
		        options: {
		            spawn: false,
		        },
		    } 
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['sass', 'concat', 'autoprefixer', 'jshint']);
};