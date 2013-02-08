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

Game.Being.prototype._getVisibleArea = function(range) {
	var result = {};
	var level = this._level;

	var lightPasses = function(x, y) {
		var cell = level.cells[x+","+y];
		return (cell && !cell.blocksLight());
	}

	var callback = function(x, y, R, amount) {
		result[x+","+y] = amount;
	}

	var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
	fov.compute(this._position[0], this._position[1], range, callback);
	return result;
}