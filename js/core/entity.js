/**
 * @class Anything with a place and a visual representation
 */
Game.Entity = function(type) {
	this._type = type;

	this._blocksLight = false;
	this._blocksMovement = false;
	this._char = "";
	this._name = "";
	this._label = "";
	this._diffuse = [120, 120, 120];

	this._color = ""; /* computed */
	this._cell = null;
	this._level = null;
	this._position = null;
}

Game.Entity.prototype.fromTemplate = function(template) {
	if ("name" in template) { this._name = template.name; }
	if ("label" in template) { this._label = template.label; }
	if ("blocksLight" in template) { this._blocksLight = template.blocksLight; }
	if ("blocksMovement" in template) { this._blocksMovement = template.blocksMovement; }
	if ("ch" in template) { 
		if (template.ch instanceof Array) {
			this._char = template.ch.random();
		} else {
			this._char = template.ch;
		}
	}
	
	if ("color" in template) {
		if ("colorVariation" in template) {
			this._diffuse = ROT.Color.randomize(template.color, template.colorVariation);
		} else {
			this._diffuse = template.color;
		}
	}
	
	return this;
}

Game.Entity.prototype.computeColor = function(ambientLight) {
	var totalLight = ambientLight;
	var cellLight = this._cell.getLight();
	if (cellLight) { totalLight = ROT.Color.add(totalLight, cellLight); }
	var color = ROT.Color.multiply(this._diffuse, totalLight);
	this._color = ROT.Color.toRGB(color);
	return this;
}

Game.Entity.prototype.getChar = function() {
	return this._char;
}

Game.Entity.prototype.getColor = function() {
	return this._color;
}

Game.Entity.prototype.isInteresting = function() {
	return true;
}

Game.Entity.prototype.blocksLight = function() {
	return this._blocksLight;
}

Game.Entity.prototype.blocksMovement = function() {
	return this._blocksMovement;
}

Game.Entity.prototype.setPosition = function(x, y, level) {
	this._level = level;
	this._position = (x === null ? null : [x, y]);
	return this;
}

Game.Entity.prototype.getPosition = function() {
	return this._position;
}

Game.Entity.prototype.describeA = function() {
	var first = this._name.charAt(0);
	if (first.match(/[aeiouy]/i)) {
		return "an " + this.describe();
	} else {
		return "a " + this.describe();
	}
}

Game.Entity.prototype.describeThe = function() {
	return "the " + this.describe();
}

Game.Entity.prototype.describe = function() {
	return this._name + (this._label ? " labeled \""+this._label + "\"" : "");
}
