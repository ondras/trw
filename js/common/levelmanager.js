/**
 * Level repository & tricks
 */
Game.LevelManager = {
	_cache: {},
	path: "levels",
	get: function(name) {
		if (name in this._cache) {
			return new Promise().fulfill(this._cache[name]);
		} else {
			var path = this.path + "/" + name + ".txt?" + ROT.RNG.getUniform(); /* bypass cache */
			return Promise.request(path).then(function(data) {
				var level = this._levelFromData(data);
				this._cache[name] = level;
				return level;
			}.bind(this)).then(null, function(){debugger;});
		}
	},

	_levelFromData: function(data) {
		// Replace Windows EOL with Unix EOL to simplify.
		data = data.replace(/\r\n/g, '\n');
		var br = data.indexOf("\n\n");
		if (br == -1) { throw new Error("No section separator"); }
		var map = data.substring(0, br).split("\n");
		var def = JSON.parse(data.substring(br));

		var ctorName = def.level.split(".");
		var ctor = window;
		while (ctorName.length) { ctor = ctor[ctorName.shift()]; }

		return new ctor().fromTemplate(map, def);
	}

}
