/**
 * Entity repository
 */
Game.Repository = function(ctor) {
	this._storage = {};
	this._defaultCtor = ctor;
}

Game.Repository.prototype.define = function(type, template) {
	if (template.extend) { /* create prototype link to parent definition */
		if (!(template.extend in this._storage)) { 
			throw new Error("Repository type '"+type+"' cannot extend '"+features.extend+"'");
		}	
		var parentTemplate = this._storage[template.extend];
		var newTemplate = Object.create(parentTemplate);
		for (var p in template) { newTemplate[p] = template[p]; }
		template = newTemplate;
	}

	this._storage[type] = template;
}

Game.Repository.prototype.create = function(type, template) {
	if (!(type in this._storage)) { throw new Error("Repository does not contain '"+type+"'"); }
	
	var finalTemplate = Object.create(this._storage[type]);
	for (var p in template) { finalTemplate[p] = template[p]; }
	
	var ctor = finalTemplate.ctor || this._defaultCtor; /* constructor function */
	return new ctor(type).fromTemplate(finalTemplate);
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
