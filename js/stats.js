Game.Stats = function(node) {
	this._node = node;
}

Game.Stats.prototype.update = function(weapon, armor, hp, maxhp) {
	var parts = [];
	if (weapon) { parts.push("You are wielding %a.".format(weapon)); }
	if (armor) { parts.push("You are wearing %a.".format(armor)); }
	
	this._node.innerHTML = parts.join("<br/>");
}
