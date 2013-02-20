Game.Stats = function(node) {
	this._node = node;
}

Game.Stats.prototype.update = function(weapon, armor, hp, maxhp) {
	var parts = [];
	if (weapon) { parts.push("You are wielding %s.".format(weapon.describeA())); }
	if (armor) { parts.push("You are wearing %s.".format(armor.describeA())); }
	
	this._node.innerHTML = parts.join("<br/>");
}
