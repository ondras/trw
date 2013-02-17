Game.Being = function(type) {
	Game.Entity.call(this, type);

	this._speed = 100;
	this._ai = new Game.AI(this);
	this._tasks = [];
	this._sightRange = 8;
	this._light = null;
	this._hostile = false;
}
Game.Being.extend(Game.Entity);

Game.Being.prototype.fromTemplate = function(template) {
	Game.Entity.prototype.fromTemplate.call(this, template);
	if ("ai" in template) {
		var ctor = Game.AI[template.ai.capitalize()];
		if (!ctor) throw new Error("AI '"+template.ai+"' not available");
		this._ai = new ctor(this);
	}
	if ("tasks" in template) { this.setTasks(template.tasks); }
	if ("hostile" in template) { this._hostile = template.hostile; }
	
	return this;
}

Game.Being.prototype.getSpeed = function() {
	return this._speed;
}

Game.Being.prototype.setPosition = function(x, y, level) {
	if (this._light && this._position) { 
		this._level.removeLight(this._position[0], this._position[1], this._light);
	}

	Game.Entity.prototype.setPosition.call(this, x, y, level);
	this._cell = (x === null ? null : this._level.cells[x+","+y]);

	if (this._light && x !== null) { 
		this._level.addLight(x, y, this._light); 
	}

	return this;
}

Game.Being.prototype.act = function() {
	if (!this._ai) { return; }
	this._ai.act(this._tasks);
}

Game.Being.prototype.getTasks = function() {
	return this._tasks;
}

Game.Being.prototype.setTasks = function(tasks) {
	this._tasks = tasks;
	return this;
}

Game.Being.prototype.setSightRange = function(range) {
	this._sightRange = range;
	return this;
}

Game.Being.prototype.setLight = function(light) {
	if (!this._level) { 
		this._light = light;
		return this;
	}
	
	if (this._light) { this._level.removeLight(this._position[0], this._position[1], this._light); }
	this._light = light;
	if (this._light) { this._level.addLight(this._position[0], this._position[1], this._light); }
	
	return this;
}

Game.Being.prototype.isHostile = function() {
	return this._hostile;
}

Game.Being.prototype.setHostile = function(hostile) {
	this._hostile = hostile;
	return this;
}

Game.Being.prototype.describe = function() {
	return (this._hostile ? "hostile " : "") + Game.Entity.prototype.describe.call(this);
}
