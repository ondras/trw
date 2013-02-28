/**
 * Entity repository
 */
Game.Repository = function(ctor) {
	this._storage = {};
	this._factoryOptions = {};
	this._defaultCtor = ctor;
}

Game.Repository.prototype.is = function(type, parent) {
	while (type) {
		if (type == parent) { return true; }
		type = this._storage[type].extend;
	}
	return false;
}

Game.Repository.prototype.define = function(type, template, factoryOptions) {
	if ("extend" in template) { /* create prototype link to parent definition */
		if (!(template.extend in this._storage)) { 
			throw new Error("Repository type '"+type+"' cannot extend '"+template.extend+"'");
		}	
		var parentTemplate = this._storage[template.extend];
		var newTemplate = Object.create(parentTemplate);
		for (var p in template) { newTemplate[p] = template[p]; }
		template = newTemplate;
	}

	this._storage[type] = template;
	this._factoryOptions[type] = factoryOptions || {};
}

Game.Repository.prototype.create = function(type, template) {
	if (!(type in this._storage)) { throw new Error("Repository does not contain '"+type+"'"); }
	
	var finalTemplate = Object.create(this._storage[type]);
	for (var p in template) { finalTemplate[p] = template[p]; }
	
	/* constructor function; ternary operator guarantees crash instead of wrong ctor */
	var ctor = ("ctor" in finalTemplate ? finalTemplate.ctor : this._defaultCtor); 
	return new ctor(type).fromTemplate(finalTemplate);
}

Game.Repository.prototype.createRandom = function(options) {
	var o = {
		include: "*",
		exclude: [],
		level: 1/0
	}
	for (var p in options) { o[p] = options[p]; }
	
	var types = {};
	var count = 0;
	
	var include = [].concat(o.include);
	var exclude = [].concat(o.exclude);
	
	for (var type in this._factoryOptions) {
		var fO = this._factoryOptions[type];
		var level = ("level" in fO ? fO.level : 1);
		if (level > o.level) { continue; }
		var weight = ("weight" in fO ? fO.weight : 1);
		var includeOK = false;
		var excludeOK = true;
		
		for (var i=0;i<include.length;i++) {
			if (this.is(type, include[i]) || include[i] == "*") { includeOK = true; }
		}

		for (var i=0;i<exclude.length;i++) {
			if (this.is(type, exclude[i])) { excludeOK = false; }
		}
		
		if (includeOK && excludeOK) { 
			types[type] = weight; 
			count++;
		}
	}

	if (!count) { throw new Error("Repository does not contain any available types"); }
	var type = ROT.RNG.getWeightedValue(types);
	return this.create(type);
}

Game.Repository.prototype.createFromObject = function(data) {
	if (typeof(data) == "string") {
		var type = data;
		var template = null;
	} else {
		var type = data.type;
		var template = data;
	}
	return this.create(type, template);
}


