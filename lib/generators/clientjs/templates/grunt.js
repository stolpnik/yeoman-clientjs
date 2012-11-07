/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		lint: {
			files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
		},
		qunit: {
			files: ['test/**/*.html']
		},
		concat: {
			default: {
				src: [
					'src/js/hogan.2.0.0.js'
					,'src/js/header.txt'
					,'src/js/calendar_settings.js'
					,'src/js/calendar_utils.js'
					,'src/js/event_data.js'
					,'src/js/event_type.js'
					,'src/js/week.js'
					,'src/js/month.js'
					,'src/js/calendar.js'
					,'src/js/calendar_renderer.js'
					,'src/js/calendar_settings_custom.js'
					,'src/js/templates.hogan.js'
					,'src/js/events.js'
					,'src/js/footer.txt'
				],
				dest: 'src/js/index.js'
			},
			prod : {
				src: '<config:concat.default.src>',
				dest: 'html/js/index.js'
			}
		},
		min: {
			default: {
				src: ['<banner:meta.banner>', 'src/js/index.js'],
				dest: 'html/js/index.min.js'
			}
		},
		coffee : {
			default : {
				src: 'src/coffee/*.coffee',
				dest: 'src/js'
			}
		},
		compass : {
			dev:{
				src: 'src/sass',
				dest: 'html/css',
				images : 'html/images',
				outputstyle: 'expanded',
				linecomments: false,
				forcecompile: true,
				debugsass: false,
				iconspritepath : 'html/images',
				iconwhitespritepath : 'html/images',
				relativeassets: true
			},
			prod:{
				src: 'src/sass',
				dest: 'html/css',
				images : 'html/images',
				outputstyle: 'compressed',
				linecomments: false,
				forcecompile: true,
				debugsass: false,
				relativeassets: true
			}
		},
		notifyGrowl : {
			coffee : {
				message : grunt.template.today() + " : coffeescript compiled",
				title : "coffee ＼(^o^)／"
			},
			compass : {
				message : grunt.template.today() + " : compass compiled",
				title : "compass ＼(^o^)／"
			},
			hogan : {
				message : grunt.template.today() + " : hogan compiled",
				title : "hogan ＼(^o^)／"
			}
		},
		uglify: {},
		//watch
		watch: {
			default : {
				files: 'src/coffee/*.coffee',
				tasks: 'coffee:default concat:default'
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'coffee');
	grunt.loadNpmTasks('grunt-compass');
	grunt.loadNpmTasks('grunt-coffee');

	grunt.registerTask('production', 'compile coffee and compass to productioin', function(){
		grunt.task.run( "hogan" );
		grunt.task.run( "concat:coffee coffee:calendar concat:prod min" );
		grunt.task.run( "compass:prod" );
		grunt.task.run( "notifyGrowl:production" );
	});

	// load tasks
	grunt.loadNpmTasks('grunt-compass');
	grunt.loadNpmTasks('grunt-coffee');

	/* Inside grunt.js file (don't forget to add "growl" as a project dependency) */

	/*grunt.utils.hooker.hook(grunt.fail, "warn", function(opt) {
	 require('growl')(opt.name, {
	 title: opt.message,
	 image: 'Console'
	 });
	 });*/

	/* ... or, since fail.fatal() will stop grunt it seems a good idea to track it too */

	var growl = require('growl');
	['warn', 'fatal'].forEach(function(level) {
		grunt.utils.hooker.hook(grunt.fail, level, function(opt) {
			growl(opt.name, {
				title: opt.message,
				image: 'growl-images/fail_icon.png'
			});
		});
	});
	grunt.task.registerMultiTask("notifyGrowl", "compile success", function() {
		growl( this.data.message, {
			title: this.target + "＼(^o^)／",
			image : "growl-images/success_icon.png"
		});
	});
	grunt.task.registerMultiTask( 'hogan', 'Precompile with `hogan.js`', function() {
		var Hogan = require('hogan.js'),
			path = require('path'),
			data = this.data,
			result ="var templates = templates || {}";
		result = "var templates = {};\n"

		var templates = grunt.file.expand(data.templates);

		templates.forEach(function(template) {
			var name = path.basename(template, path.extname(template));
			try {
				result += "\ntemplates['" + name +"']=new Hogan.Template(" +
					Hogan.compile(grunt.file.read(template).toString(), {asString:true}) + ");";
			} catch (error) {
				grunt.log.writeln("Error compiling template " + name + " in " + template);
				throw error;
			}
		});
		grunt.file.write(data.output, result);
	});

};
