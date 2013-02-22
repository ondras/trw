Game.Item.Weapon = function(type) {
	Game.Item.call(this, type);
	this._damage = 1;
	/* FIXME speed? to-hit? */
}

Game.Item.Weapon.extend(Game.Item);

Game.Item.Weapon.prototype.fromTemplate = function(template) {
	Game.Item.prototype.fromTemplate.call(this, template);
	if ("damage" in template) { this._damage = template.damage; }
	return this;
}

Game.Item.Weapon.prototype.getDamage = function() {
	return this._damage;
}
