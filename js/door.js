Game.Cell.Door = function(type) {
	Game.Cell.call(this, type);
	this._closed = false;
	this._locked = false;
}
Game.Cell.Door.extend(Game.Cell);

Game.Cell.Door.prototype.fromTemplate = function(template) {
	Game.Cell.prototype.fromTemplate.call(this, template);
	this.open();
	if ("closed" in template) {
		if (template.closed) { this.close(); } else { this.open(); }
	}
	if ("locked" in template) { this.lock(); }
	return this;
}

Game.Cell.Door.prototype.isClosed = function() {
	return this._closed;
}

Game.Cell.Door.prototype.isLocked = function() {
	return this._locked;
}

Game.Cell.Door.prototype.close = function() {
	this._closed = true;
	this._char = "+";
	this._name = "closed door";
	if (this._level) { this._level.resetLighting(); }
}

Game.Cell.Door.prototype.open = function() {
	this.unlock();
	this._closed = false;
	this._char = "/";
	this._name = "open door";
	if (this._level) { this._level.resetLighting(); }
}

Game.Cell.Door.prototype.lock = function() {
	this.close();
	this._locked = true;
}

Game.Cell.Door.prototype.unlock = function() {
	this._locked = false;
}

Game.Cell.Door.prototype.blocksLight = function() {

	return this._closed;
}

Game.Cell.Door.prototype.blocksMovement = function() {
	return this._closed;
}

