Game.Item.Weapon = function(type) {
	Game.Item.call(this, type);
	this._damage = 1;
	this._description = null;
	/* FIXME speed? to-hit? */
}

Game.Item.Weapon.extend(Game.Item);

Game.Item.Weapon.prototype.fromTemplate = function(template) {
	Game.Item.prototype.fromTemplate.call(this, template);
	if ("damage" in template) { this._damage = template.damage; }
	if ("description" in template) { this._description = template.description; }
	return this;
}

Game.Item.Weapon.prototype.getDamage = function() {
	return this._damage;
}

Game.Item.Weapon.prototype.getDescription = function() {
	return this._description;
}
