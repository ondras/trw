Game.Item.Weapon = function(type) {
	Game.Item.call(this, type);
	this._description = null;
	this._damage = 1;
	this._speed = 100;
}

Game.Item.Weapon.extend(Game.Item);

Game.Item.Weapon.prototype.fromTemplate = function(template) {
	Game.Item.prototype.fromTemplate.call(this, template);
	if ("speed" in template) { this._speed = template.speed; }
	if ("damage" in template) { this._damage = template.damage; }
	if ("description" in template) { this._description = template.description; }
	return this;
}

Game.Item.Weapon.prototype.getDamage = function() {
	return this._damage;
}

Game.Item.Weapon.prototype.getSpeed = function() {
	return this._speed;
}

Game.Item.Weapon.prototype.getDescription = function() {
	return this._description;
}
