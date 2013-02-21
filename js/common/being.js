Game.Being = function(type) {
	Game.Entity.call(this, type);

	this._speed = 100;
	this._ai = new Game.AI(this);
	this._tasks = [];
	this._sightRange = 8;
	this._hostile = false;
	this._chats = null;
	
	this._chattedWith = false;
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
	if ("chats" in template) { this._chats = template.chats; }
	
	return this;
}

Game.Being.prototype.getSpeed = function() {
	return this._speed;
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

Game.Being.prototype.chat = function(being) {
	this._chattedWith = true;
	return (this._chats ? this._chats.random() : null);
}

Game.Being.prototype.chattedWith = function() {
	return this._chattedWith;
}

Game.Being.prototype.getChats = function() {
	return this._chats;
}

Game.Being.prototype.setChats = function(chats) {
	this._chats = chats;
	return this;
}

Game.Being.prototype._die = function() {
	var corpse = Game.Items.create("corpse", {color:this._color, name:this._name+" corpse"});
	this._level.setItem(corpse, this._position[0], this._position[1]);
	this._level.removeBeing(this);
	Game.engine.removeActor(this);
}
