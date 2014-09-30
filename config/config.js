async = require('async');
fs = require('fs');

// Config is the superclass from which all configuration objects descend
// Common functionality is implemented here.
Config = function() {
	this._cache = {}
}

Config.prototype.get = function(k) {
	return this._cache[k];
}

Config.prototype.set = function(k,v, callback) {
	return this.update({k:v}, callback);
}

// The load function retreives a configuration from disk and loads it into the configuration object
Config.prototype.load = function(filename, callback) {
	fs.readFile(filename, 'utf8', function (err, data) {
		if (err) { return callback(err); }
		try {
			data = JSON.parse(data);
		} catch (e) {
			return callback(e);
		}
		this.update(data, callback);
	}.bind(this));
}

// The init function performs an initial load() from the configuration's settings files.
// For this to work, the Config object has to have a default_config_file and config_file member
Config.prototype.init = function(callback) {
		async.series(
		[
			function(callback) { this.load(this.default_config_file, callback); }.bind(this),
			function(callback) { this.load(this.config_file, callback); }.bind(this),
		],
		function(err, results) {
			if(err) { callback(err); }
			else { callback(null, this); }
		}.bind(this)
	);
}

exports.Config = Config