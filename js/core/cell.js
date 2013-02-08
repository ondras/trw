Game.Cell = function(type) {
	Game.Entity.call(this, type);
	
	this._light = null; /* computed light */
	this._cell = this;
	this._id = null;
	this._portal = null;
}
Game.Cell.extend(Game.Entity);

Game.Cell.prototype.fromTemplate = function(template) {
	Game.Entity.prototype.fromTemplate.call(this, template);
	if ("id" in template) { this.setId(template.id); }
	if ("portal" in template) { 
		var targetParts = template.portal.target.split("#");
		var level = targetParts[0] || null;
		var cell = targetParts[1] || "start";
		this.setPortal(level, cell, template.portal.direction);
	}
	return this;
}

Game.Cell.prototype.setId = function(id) {
	this._id = id;
	return this;
}

Game.Cell.prototype.isInteresting = function() {
	if (this._label) { return true; }
	var defaultTypes = this._level.getDefaultCellTypes();
	return (defaultTypes.indexOf(this._type) == -1);
}

Game.Cell.prototype.getId = function() {
	return this._id;
}

Game.Cell.prototype.getLight = function() {
	return this._light;
}

Game.Cell.prototype.setLight = function(light) {
	this._light = light;
	return this;
}

/**
 * @param {string || Game.Level || null} level
 * @param {string} cell ID
 * @param {string} direction
 */
Game.Cell.prototype.setPortal = function(level, cell, direction) {
	this._portal = {
		level: level,
		cell: cell,
		direction: direction
	};
	return this;
}

/**
 * An entity moves here
 */
Game.Cell.prototype.notify = function(entity) {
	if (entity != Game.player) { return; }
	if (this._level == Game.level && this._portal) { this._usePortal(entity); }
}

Game.Cell.prototype._usePortal = function(entity) {
	var level = this._portal.level || this._level;
	var cell = this._portal.cell;
	var direction = this._portal.direction;

	if (level == this._level) { /* move within this level */
		var position = this._level.getCellById(cell).getPosition();
		this._level.setBeing(entity, position[0], position[1]);
	} else if (level instanceof Game.Level) { /* switch to a complete level */
		Game.switchLevel(level, cell, direction);
	} else { /* get level, remember it and switch to it */
		Game.engine.lock();
		Game.levels.get(level).then(function(level) {
			this._portal.level = level;
			Game.switchLevel(level, cell, direction);
			Game.engine.unlock();
		}.bind(this));
	}
}
