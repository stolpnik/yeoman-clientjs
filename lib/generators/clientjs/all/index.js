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
	this.directory('html');
	this.directory('src');
	this.directory('test');
};

Generator.prototype.setupFiles = function setupPackage(){
	this.copy('Grantfile.js', 'Grantfile.js');
	this.template('package.json');
	this.template('LICENSE');
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