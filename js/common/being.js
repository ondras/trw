Game.Being = function(type) {
	Game.Entity.call(this, type);

	this._speed = 100;
	this._ai = new Game.AI(this);
	this._tasks = [];
	this._sightRange = 8;
	this._hostile = false;
	this._chats = null;
	this._sex = 0;

	this._hp = 1;
	this._damage = 1;
	this._pv = 1;
	
	this._chattedWith = false;
}
Game.Being.extend(Game.Entity);

Game.Being.prototype.fromTemplate = function(template) {
	Game.Entity.prototype.fromTemplate.call(this, template);
	if ("ai" in template) {
		var ctor = Game.AI[template.ai.capitalize()];
		if (!ctor) throw new Error("AI '"+template.ai+"' not available");
		this._ai = new ctor(this);
	}
	if ("tasks" in template) { this.setTasks(template.tasks.slice()); }
	if ("hostile" in template) { this._hostile = template.hostile; }
	if ("chats" in template) { this._chats = template.chats; }
	if ("sight" in template) { this._sightRange = template.sight; }
	if ("hp" in template) { this._hp = template.hp; }
	if ("pv" in template) { this._pv = template.pv; }
	if ("damage" in template) { this._damage = template.damage; }

	if (this._hostile) { this._tasks.push("attack"); }
	
	return this;
}

Game.Being.prototype.getSpeed = function() {
	return this._speed;
}

Game.Being.prototype.isAlive = function() {
	return (this._hp > 0);
}

Game.Being.prototype.act = function() {
	if (!this._ai) { return; }
	this._ai.act(this._tasks);
}

Game.Being.prototype.getTasks = function() {
	return this._tasks;
}

Game.Being.prototype.setTasks = function(tasks) {
	this._tasks = tasks;
	return this;
}

Game.Being.prototype.getSightRange = function() {
	return this._sightRange;
}

Game.Being.prototype.setSightRange = function(range) {
	this._sightRange = range;
	return this;
}

Game.Being.prototype.isHostile = function() {
	return this._hostile;
}

Game.Being.prototype.setHostile = function(hostile) {
	this._hostile = hostile;
	return this;
}

Game.Being.prototype.chat = function(being) {
	this._chattedWith = true;
	return (this._chats ? this._chats.random() : null);
}

Game.Being.prototype.chattedWith = function() {
	return this._chattedWith;
}

Game.Being.prototype.getChats = function() {
	return this._chats;
}

Game.Being.prototype.setChats = function(chats) {
	this._chats = chats;
	return this;
}

Game.Being.prototype.getDamage = function() {
	return this._damage + (this._weapon ? this._weapon.getDamage() : 0);
}

Game.Being.prototype.getPV = function() {
	return this._pv + (this._armor ? this._armor.getPV() : 0);
}

Game.Being.prototype.adjustHP = function(diff) {
	this._hp = Math.max(0, this._hp + diff);
	if (!this._hp) { this._die(); }
	return this;
}

Game.Being.prototype.attack = function(target) {
	/* FIXME probably refactor to a dedicated attack logic? */

	/* 1. hit? */
	var speed1 = this.getSpeed() + ROT.RNG.getNormal(0, 5);
	var speed2 = target.getSpeed() + ROT.RNG.getNormal(0, 5);

	/* 1a. miss */
	if (speed1 < speed2) {
		Game.status.show("%The %verb,miss %the.".format(this, this, target));
		return; 
	}

	/* 1b. hit */
		var dmg = this.getDamage() + ROT.RNG.getNormal(0, 1);
	var pv = target.getPV() + ROT.RNG.getNormal(0, 1);
	dmg = Math.round(dmg-pv);

	/* 2a. not enough damage */
	if (dmg <= 0) {
		Game.status.show("%The %verb,fail to hurt %the.".format(this, this, target));
		return;
	}

	/* 2b. damage */
	target.adjustHP(-dmg);	
	var str = "%The %verb,hit %the".format(this, this, target);
	if (target.isAlive()) {
		str += ".";
	} else {
		str += " and %verb,kill %him.".format(this, target);
	}
	Game.status.show(str);
}

Game.Being.prototype._die = function() {
	var corpse = Game.Items.create("corpse", {color:this._color, name:this._name+" corpse"});
	this._level.setItem(corpse, this._position[0], this._position[1]);
	this._level.removeBeing(this);
	Game.engine.removeActor(this);
}

Game.Being.prototype.describeVerb = function(verb) {
	return verb + (verb.charAt(verb.length-1) == "s" ? "e" : "") + "s";
}

Game.Being.prototype.describeHim = function() {
	return ["it", "him", "her"][this._sex];
}
