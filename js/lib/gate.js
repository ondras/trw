Game.Cell.Gate = function(type) {
	Game.Cell.Door.call(this, type);

	this._bumpedInto = false;
	this._name = "castle gate";
	this.close();
	this.lock();
	
}
Game.Cell.Gate.extend(Game.Cell.Door);

Game.Cell.Gate.prototype.bumpInto = function(being) {
	this._bumpedInto = true;
	return Game.Cell.Door.prototype.bumpInto.call(this, being);
}

Game.Cell.Gate.prototype.bumpedInto = function() {
	return this._bumpedInto;
}
