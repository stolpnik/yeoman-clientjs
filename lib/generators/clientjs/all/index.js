var util   = require('util'),
	path   = require('path'),
	yeoman = require('yeoman'),
	exec = require('child_process').exec;

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

  // this is the default. Uncomment and change the path if you want
  // to change the source root directory for this generator.
  //
  // this.sourceRoot(path.join(__dirname, 'templates'));

}

util.inherits(Generator, yeoman.generators.NamedBase);
/*
Generator.prototype.setupEnv = function setupEnv() {
	// Copies the contents of the generator `templates`
	// directory into your users new application path
	this.directory('.','.');
};
*/

Generator.prototype.seupDirs = function seupHtmlDir(){
	this.directory('docs');
	this.directory('growl-images');
	this.directory('app');
	this.directory('src');
	this.directory('dist');
	this.directory('test');
};

Generator.prototype.setupFiles = function setupPackage(){
	this.copy('Gruntfile.js', 'Gruntfile.js');
	this.template('package.json');
	this.template('LICENSE');
	this.template('testem.json');
	this.template('gitignore', '.gitignore');
};

Generator.prototype.finalize = function finalize() {
	var cb = this.async()
		, self = this;

	exec('npm install', function (err, stdout, stderr) {
		if (stdout) self.log.writeln(stdout);
		if (err) self.log.error(stderr);
		cb();
	});
};