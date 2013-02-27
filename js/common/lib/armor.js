Game.Item.Armor = function(type) {
	Game.Item.call(this, type);
	this._description = null;
	this._speed = 100;
	this._pv = 1;
}

Game.Item.Armor.extend(Game.Item);

Game.Item.Armor.prototype.fromTemplate = function(template) {
	Game.Item.prototype.fromTemplate.call(this, template);
	if ("description" in template) { this._description = template.description; }
	if ("speed" in template) { this._speed = template.speed; }
	return this;
}

Game.Item.Armor.prototype.getDescription = function() {
	return this._description;
}

Game.Item.Armor.prototype.getSpeed = function() {
	return this._speed;
}

Game.Item.Armor.prototype.getPV = function() {
	return this._pv;
}
