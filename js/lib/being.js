Game.Being = function(type) {
	Game.Entity.call(this, type);

	this._blocksMovement = true;
	this._speed = 100;
}
Game.Being.extend(Game.Entity);

Game.Being.prototype.getSpeed = function() {
	return this._speed;
}

Game.Being.prototype.setPosition = function(x, y, level) {
	Game.Entity.prototype.setPosition.call(this, x, y, level);
	this._cell = (x === null ? null : this._level.cells[x+","+y]);
	return this;
}

Game.Being.prototype.act = function() {
}

Game.Being.prototype._isPassable = function(x, y) {
	var key = x+","+y;
	if (key in this._level.beings) { return false; }
	
	return !(this._level.cells[key].blocksMovement());
}
