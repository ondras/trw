Game.Item = function(type) {
	Game.Entity.call(this, type);
};
Game.Item.extend(Game.Entity);

Game.Item.prototype.fromTemplate = function(template) {
	Game.Entity.prototype.fromTemplate.call(this, template);
	if ("light" in template) {
		this._light = template.light;
	}
	return this;
}

Game.Item.prototype.setPosition = function(x, y, level) {
	if (this._light && this._position) {
		this._level.removeLight(this._position[0], this._position[1], this._light);
	}

	Game.Entity.prototype.setPosition.call(this, x, y, level);

	this._cell = (x === null ? null : this._level.cells[x+","+y]);
	
	if (this._light && x !== null) {
		this._level.addLight(this._position[0], this._position[1], this._light);
	}
	return this;
}
