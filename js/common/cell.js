Game.Cell = function(type) {
	Game.Entity.call(this, type);
	
	this._blocksLight = false;
	this._blocksMovement = false;

	this._totalLight = null; /* computed light */
	this._portal = null;
}
Game.Cell.extend(Game.Entity);

Game.Cell.prototype.fromTemplate = function(template) {
	Game.Entity.prototype.fromTemplate.call(this, template);
	if ("blocksLight" in template) { this._blocksLight = template.blocksLight; }
	if ("blocksMovement" in template) { this._blocksMovement = template.blocksMovement; }
	if ("portal" in template) { 
		var targetParts = template.portal.target.split("#");
		var level = targetParts[0] || null;
		var cell = targetParts[1] || "start";
		this.setPortal(level, cell, template.portal.direction);
	}
	return this;
}

Game.Cell.prototype.setPosition = function(x, y, level) {
	Game.Entity.prototype.setPosition.call(this, x, y, level);
	this._cell = this;
	return this;
}

/**
 * Total amount of light at this cell
 */
Game.Cell.prototype.getTotalLight = function() {
	return this._totalLight;
}

Game.Cell.prototype.setTotalLight = function(light) {
	this._totalLight = light;
	return this;
}

Game.Cell.prototype.bumpInto = function(being) {
	if (being == Game.player) { Game.status.show("%s blocks the way.", this.describeA().capitalize()); }
}

Game.Cell.prototype.blocksLight = function() {
	return this._blocksLight;
}

Game.Cell.prototype.blocksMovement = function() {
	return this._blocksMovement;
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
		Game.LevelManager.get(level).then(function(level) {
			this._portal.level = level;
			Game.switchLevel(level, cell, direction);
			Game.engine.unlock();
		}.bind(this));
	}
}
