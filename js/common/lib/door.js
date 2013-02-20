Game.Cell.Door = function(type) {
	Game.Cell.call(this, type);
	this._closed = false;
	this._locked = false;
	this._name = "door";
	this.open();
}
Game.Cell.Door.extend(Game.Cell);

Game.Cell.Door.prototype.fromTemplate = function(template) {
	Game.Cell.prototype.fromTemplate.call(this, template);
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
	if (this._level) { 
		this._level.resetLighting(); 
		Game.player.updateVisibility();
	}
}

Game.Cell.Door.prototype.open = function() {
	this.unlock();
	this._closed = false;
	this._char = "/";
	if (this._level) { 
		this._level.resetLighting(); 
		Game.player.updateVisibility();
	}
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

Game.Cell.Door.prototype.describe = function() {
	return (this._closed ? "closed" : "open") + " " + Game.Cell.prototype.describe.call(this);
}

Game.Cell.Door.prototype.bumpInto = function(being) {
	if (being == Game.player) { 
		if (this._locked) {
			Game.status.show("This %s is locked!", this._name); 
		} else {
			Game.status.show("You open the %s.", this._name); 
			this.open();
		}
	} else {
		if (!this._locked) { this.open(); }
	}
}
