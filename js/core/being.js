Game.Being = function(type) {
	Game.Entity.call(this, type);

	this._speed = 100;
	this._ai = new Game.AI(this);
	this._tasks = [];
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
	
	return this;
}

Game.Being.prototype.getSpeed = function() {
	return this._speed;
}

Game.Being.prototype.setPosition = function(x, y, level) {
	Game.Entity.prototype.setPosition.call(this, x, y, level);
	this._cell = (x === null ? null : this._level.cells[x+","+y]);
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

