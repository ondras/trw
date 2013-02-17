/**
 * @class Anything with a place and a visual representation
 */
Game.Entity = function(type) {
	this._type = type;

	this._char = "";
	this._name = "";
	this._diffuse = [120, 120, 120];

	this._color = ""; /* computed */
	this._cell = null;
	this._level = null;
	this._position = null;
}

Game.Entity.prototype.fromTemplate = function(template) {
	if ("name" in template) { this._name = template.name; }
	if ("char" in template) { 
		if (template["char"] instanceof Array) {
			this._char = template["char"].random();
		} else {
			this._char = template["char"];
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
	this._color = ROT.Color.multiply(this._diffuse, totalLight);
	return this;
}

Game.Entity.prototype.getChar = function() {
	return this._char;
}

Game.Entity.prototype.getColor = function() {
	return this._color;
}

Game.Entity.prototype.getType = function() {
	return this._type;
}

Game.Entity.prototype.setPosition = function(x, y, level) {
	this._level = level;
	this._position = (x === null ? null : [x, y]);
	return this;
}

Game.Entity.prototype.getPosition = function() {
	return this._position;
}

Game.Entity.prototype.getLevel = function() {
	return this._level;
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
	return this._name;
}
