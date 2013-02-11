Game.Level = function() {
	this.cells = {};
	this.beings = {};
	this.items = {};

	this._display = new ROT.Display({fontFamily:"droid sans mono, monospace"});
	this._ambientLight = [130, 130, 130];
	this._topology = 8;
	this._lights = {};
	this._defaultCell = "floor";
	this._name = "";
	this._visibleArea = {};

	this._node = document.createElement("section");
	this._node.appendChild(this._display.getContainer());

	this._lighting = new ROT.Lighting(this._getReflectivity.bind(this), {passes:1});
	var fov = new ROT.FOV.PreciseShadowcasting(this._lightPasses.bind(this), {topology:this._topology});
	this._lighting.setFOV(fov);
}

Game.Level.prototype.fromTemplate = function(map, def) {
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

	this._display.setOptions({width:width, height:height});

	return this;
}

Game.Level.prototype._fromChar = function(x, y, ch, def) {
	var d = def[ch];
	if (!d) { throw new Error("Unknown character '" + ch + "'"); }

	if (d.cell) {
		if (typeof(d.cell) == "object" && !d.cell.type) { d.cell.type = this._defaultCell; }
		var cell = Game.Cells.createFromObject(d.cell);
	} else {
		var cell = Game.Cells.createFromObject(this._defaultCell);
	}
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

/**
 * This level is being used right now.
 */
Game.Level.prototype.notify = function() {}

Game.Level.prototype.getContainer = function() {
	return this._node;
}

Game.Level.prototype.getCellById = function(id) {
	for (var key in this.cells) {
		if (this.cells[key].getId() == id) { return this.cells[key]; }
	}
	return null;
}

Game.Level.prototype.getTopology = function() {
	return this._topology;
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
	this._setEntity(being, x, y, "beings");
}
	
Game.Level.prototype.setItem = function(item, x, y) {
	this._setEntity(item, x, y, "items");
}

Game.Level.prototype.removeBeing = function(being) {
	this._removeEntity(being, "beings");
}

Game.Level.prototype.resize = function(width, height) {
	var fontSize = this._display.computeFontSize(width, height);
	this._display.setOptions({fontSize:fontSize});
	var canvas = this._display.getContainer();
	canvas.style.top = Math.floor((height-canvas.height)/2) + "px";
}

Game.Level.prototype.updateLighting = function() {
	var dirty = {};
	var cells = this.cells;
	
	for (var key in cells) {
		var cell = cells[key];
		if (!cell.getLight()) { continue; }
		dirty[key] = 1;
		cell.setLight(null);
	}

	this._lighting.compute(function(x, y, color) {
		var key = x+","+y;
		if (!cells[key]) { return; }
		cells[key].setLight(color);
		dirty[key] = 1;
	});
	
	for (var key in dirty) {
		var cell = cells[key];
		cell.computeColor(this._ambientLight);
		
		if (this.items[key]) { this.items[key].computeColor(this._ambientLight); }
		if (this.beings[key]) { this.beings[key].computeColor(this._ambientLight); }
		
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

/**
 * @param {Game.Entity}
 */
Game.Level.prototype._setEntity = function(entity, x, y, type) {
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

	entity.setPosition(x, y, this);
	entity.computeColor(this._ambientLight);

	if (x !== null) {
		var key = x+","+y;
		this[type][key] = entity;
		this._draw(x, y);
		var cell = this.cells[key];
		cell.notify(entity);
	}
	
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

	var visual = this.beings[key] || this.items[key] || this.cells[key];
	if (visual) { this._display.draw(x, y, visual.getChar(), ROT.Color.toRGB(visual.getColor())); }
}

Game.Level.prototype._drawFog = function(x, y) {
	var key = x+","+y;

	var visual = this.items[key] || this.cells[key]; /* beings are not drawn in fog */
	if (visual) { 
		var color = visual.getColor();
		
		/* 1. lightness */
		var gray = (Math.max.apply(null, color) + Math.min.apply(null, color))/2;

		/* 2. luminosity */
		var gray = 0.299*color[0]+0.587*color[1]+0.114*color[2];

		/* 3. average */
		var gray = (color[0]+color[1]+color[2])/3;
		
//		color[0] = color[1] = color[2] = Math.round(gray);
		color[0] = Math.round((color[0]+gray)/2);
		color[1] = Math.round((color[1]+gray)/2);
		color[2] = Math.round((color[2]+gray)/2);
		this._display.draw(x, y, visual.getChar(), ROT.Color.toRGB(color)); 
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
