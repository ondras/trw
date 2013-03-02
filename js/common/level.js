Game.Level = function() {
	this.cells = {};
	this.beings = {};
	this.items = {};

	this._display = new Game.Display({fontFamily:"droid sans mono, monospace"});
	this._ambientLight = [130, 130, 130];
	this._sightRange = 10;
	
	this._lights = {};
	this._portals = {};
	this._visibleArea = {};

	this._rules = [];
	this._story = {};

	this._node = document.createElement("section");
	this._node.appendChild(this._display.getContainer());

	this._lighting = new ROT.Lighting(this._getReflectivity.bind(this), {passes:1});
	var fov = new ROT.FOV.PreciseShadowcasting(this._lightPasses.bind(this), {topology:8});
	this._lighting.setFOV(fov);
}

Game.Level.prototype.fromTemplate = function(map, def) {
	if ("light" in def) { this._ambientLight = def.light; }
	if ("sight" in def) { this._sightRange = def.sight; }
	if ("portals" in def) { this._portals = def.portals; }

	var width = 0, height = 0;

	for (var j=0;j<map.length;j++) {
		var line = map[j];
		if (!line.length) { continue; }
		height++;
		width = Math.max(width, line.length);
		
		for (var i=0;i<line.length;i++) {
			var ch = line.charAt(i);
			if (ch == " ") { continue; }
			this._fromChar(i, j, ch, def);
		}
	}

	return this.setSize(width, height);
}

Game.Level.prototype.setSize = function(width, height) {
	this._display.setOptions({width:width, height:height});
	return this;
}

Game.Level.prototype._fromChar = function(x, y, ch, def) {
	var d = def[ch];
	if (!d) { throw new Error("Unknown character '" + ch + "'"); }

	var cell = Game.Cells.createFromObject(d.cell);
	this.setCell(cell, x, y);

	if (d.being) {
		var being = Game.Beings.createFromObject(d.being);
		this.setBeing(being, x, y);
	}
	
	if (d.item) {
		var item = Game.Items.createFromObject(d.item);
		this.setItem(item, x, y);
	}
	
	if (d.light) {
		this.addLight(x, y, d.light);
	}
}

Game.Level.prototype.getFontSize = function() {
	return this._display.getOptions().fontSize;
}

Game.Level.prototype.getContainer = function() {
	return this._node;
}

Game.Level.prototype.getVisibleArea = function() {
	return this._visibleArea;
}

Game.Level.prototype.getCellById = function(id) {
	for (var key in this.cells) {
		if (this.cells[key].getId() == id) { return this.cells[key]; }
	}
	return null;
}

Game.Level.prototype.resetLighting = function() {
	this._lighting.reset();
}

Game.Level.prototype.addLight = function(x, y, light) {
	var key = x+","+y;
	if (key in this._lights) {
		this._lights[key] = ROT.Color.add(this._lights[key], light);
	} else {
		this._lights[key] = light;
	}

	this._lighting.setLight(x, y, this._lights[key]);
}

Game.Level.prototype.removeLight = function(x, y, light) {
	var key = x+","+y;

	var targetLight = ROT.Color.add(this._lights[key], [-light[0], -light[1], -light[2]]);
	if (targetLight[0] == 0 && targetLight[1] == 0 && targetLight[2] == 0) { 
		delete this._lights[key];
	} else {
		this._lights[key] = targetLight;
	}

	this._lighting.setLight(x, y, this._lights[key]);
}

Game.Level.prototype.setCell = function(cell, x, y) {
	var key = x+","+y;
	var oldBlocking = (this.cells[key] ? this.cells[key].blocksLight() : null);

	this._setEntity(cell, x, y, "cells");
	
	var newBlocking = cell.blocksLight();
	if (oldBlocking != newBlocking) { this._lighting.reset(); }
}

Game.Level.prototype.setBeing = function(being, x, y) {
	if (being.getLevel() != this) { this._welcomeBeing(being); }
	this._setEntity(being, x, y, "beings");
	
	/* change level? */
	var id = this.cells[x+","+y].getId();
	if (being == Game.player && id in this._portals) { this._enterPortal(id); }
}
	
Game.Level.prototype.setItem = function(item, x, y) {
	this._setEntity(item, x, y, "items");
}

Game.Level.prototype.removeBeing = function(being) {
	this._removeEntity(being, "beings");
}

Game.Level.prototype.removeItem = function(item) {
	this._removeEntity(item, "items");
}

Game.Level.prototype.resize = function(width, height) {
	var fontSize = this._display.computeFontSize(width, height);
	this._display.setOptions({fontSize:fontSize});
	var canvas = this._display.getContainer();
	canvas.style.top = Math.floor((height-canvas.height)/2) + "px";
	return this;
}

Game.Level.prototype.updateLighting = function() {
	var dirty = {};
	var cells = this.cells;
	
	for (var key in cells) {
		var cell = cells[key];
		if (!cell.getTotalLight()) { continue; }
		dirty[key] = 1;
		cell.setTotalLight(null);
	}

	this._lighting.compute(function(x, y, color) {
		var key = x+","+y;
		if (!cells[key]) { return; }
		cells[key].setTotalLight(color);
		dirty[key] = 1;
	});
	
	for (var key in dirty) {
		var cell = cells[key];
		var light = cell.getTotalLight();

		cell.computeColor(this._ambientLight, light);
		
		if (this.items[key]) { this.items[key].computeColor(this._ambientLight, light); }
		if (this.beings[key]) { this.beings[key].computeColor(this._ambientLight, light); }
		
		var parts = key.split(",");
		this._draw(parseInt(parts[0]), parseInt(parts[1]));
	}
}

/**
 * @param {object} visibility Key = x+y, value = FOV amount
 */
Game.Level.prototype.setVisibility = function(newVisible) {
	if (newVisible === true) {
		newVisible = {};
		for (var key in this.cells) { newVisible[key] = 1; }
	}
	
	/* merge into the currently visible area */
	var oldVisible = this._visibleArea;
	for (var key in oldVisible) {
		if (key in newVisible) { /* remains visible */
			delete newVisible[key]; /* so that only newly visible remain there */
		} else { /* we can no longer see this one */
			var parts = key.split(",");
			this._drawFog(parseInt(parts[0]), parseInt(parts[1]));
			delete oldVisible[key];
		}
	}
	
	for (var key in newVisible) { /* newly visible; need to be drawn */
		oldVisible[key] = newVisible[key];
		var parts = key.split(",");
		this._draw(parseInt(parts[0]), parseInt(parts[1]));
	}
}

Game.Level.prototype.checkRules = function() {
	for (var i=0;i<this._rules.length;i++) {
		var rule = this._rules[i];
		if (rule.conditions.call(this)) { 
			var result = rule.actions.call(this);
			if (result) { 
				this._rules.splice(i, 1); 
				i--;
			}
		}
	}
}

Game.Level.prototype._addRule = function(conditions, actions) {
	var rule = {conditions:conditions, actions:actions};
	this._rules.push(rule);
	return this;
}

/**
 * @param {Game.Entity}
 */
Game.Level.prototype._setEntity = function(entity, x, y, type) {
	var key = x+","+y;

	var oldPosition = entity.getPosition();
	if (oldPosition) {
		var oldKey = oldPosition.join(",");
		if (this[type][oldKey] == entity) { 
			delete this[type][oldKey]; 
		} else { /* remove the old one */
			this._removeEntity(entity, x, y, type);
		}
		this._draw(oldPosition[0], oldPosition[1]);
	}

	this[type][key] = entity;
	entity.setPosition(x, y, this);

	var cell = this.cells[key];
	var light = (cell ? cell.getTotalLight() : null);
	entity.computeColor(this._ambientLight, light);

	this._draw(x, y);
}

Game.Level.prototype._removeEntity = function(entity, type) {
	var oldPosition = entity.getPosition();
	if (!oldPosition) { return; }

	var oldKey = oldPosition.join(",");
	if (this[type][oldKey] == entity) { delete this[type][oldKey]; }
	entity.setPosition(null);

	this._draw(oldPosition[0], oldPosition[1]);
}

Game.Level.prototype._draw = function(x, y) {
	var key = x+","+y;
	if (!(key in this._visibleArea)) { return; }

	var entity = this.beings[key] || this.items[key] || this.cells[key];
	if (entity) { 
		this._display.draw(x, y, entity.getChar(), ROT.Color.toRGB(entity.getColor())); 
		if (entity == Game.player && entity.getHP()) { this._display.setCursor(x, y); }
	}
}

Game.Level.prototype._drawFog = function(x, y) {
	var key = x+","+y;

	var entity = this.items[key] || this.cells[key]; /* beings are not drawn in fog */
	if (entity) { 
		var color = entity.getColor();
		
		/* 1. lightness */
		var gray = (Math.max.apply(null, color) + Math.min.apply(null, color))/2;

		/* 2. luminosity */
		var gray = 0.299*color[0]+0.587*color[1]+0.114*color[2];

		/* 3. average */
		var gray = (color[0]+color[1]+color[2])/3;

		var c1 = 0.4;
		var c2 = 1-c1;
		
		color[0] = Math.round(c1*color[0]+c2*gray);
		color[1] = Math.round(c1*color[1]+c2*gray);
		color[2] = Math.round(c1*color[2]+c2*gray);
		this._display.draw(x, y, entity.getChar(), ROT.Color.toRGB(color)); 
	}
}

Game.Level.prototype._getReflectivity = function(x, y) {
	var key = x+","+y;

	var cell = this.cells[key];
	if (!cell) { return 0; }
	return (cell.blocksLight() ? 0 : 0.3);
}

Game.Level.prototype._lightPasses = function(x, y) {
	var key = x+","+y;

	var cell = this.cells[key];
	if (!cell) { return false; }

	return !(cell.blocksLight());
}

Game.Level.prototype._welcomeBeing = function(being) {
	if (being == Game.player) { being.setSightRange(this._sightRange); }
}

Game.Level.prototype._enterPortal = function(id) {
	var portal = this._portals[id];
	var level = portal.level || this;

	if (level == this._level) { /* move within this level */
		var position = this.getCellById(portal.cell).getPosition();
		this.setBeing(being, position[0], position[1]);
	} else if (level instanceof Game.Level) { /* switch to a complete level */
		Game.switchLevel(level, portal.cell, portal.direction);
	} else { /* get level, remember it and switch to it */
		Game.engine.lock();
		Game.LevelManager.get(level).then(function(level) {
			portal.level = level;
			Game.switchLevel(level, portal.cell, portal.direction);
			Game.engine.unlock();
		}.bind(this));
	}
}	
