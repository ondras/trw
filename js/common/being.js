Game.Being = function(type) {
	Game.Entity.call(this, type);

	this._speed = 100;
	this._ai = new Game.AI(this);
	this._tasks = [];
	this._sightRange = 8;
	this._hostile = false;
	this._chats = null;
	this._sex = 0;
	this._weapon = null;
	this._armor = null;

	this._kills = 0;
	this._hp = 1;
	this._maxHP = this._hp;

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
	if ("sex" in template) { this._sex = (template.sex instanceof Array ? template.sex.random() : template.sex); }
	if ("speed" in template) { this._speed = template.speed;; }
	if ("tasks" in template) { this._tasks = template.tasks.slice(); }
	if ("hostile" in template) { this._hostile = this.setHostile(true); }
	if ("chats" in template) { this._chats = template.chats; }
	if ("sight" in template) { this._sightRange = template.sight; }
	if ("hp" in template) { this._hp = template.hp; }
	if ("pv" in template) { this._pv = template.pv; }
	if ("damage" in template) { this._damage = template.damage; }

	this._maxHP = this._hp;
	
	return this;
}

Game.Being.prototype.getAttackSpeed = function() {
	var speed = this._speed;
	var count = 1;
	
	if (this._weapon) {
		speed += this._weapon.getSpeed();
		count++;
	}
	
	if (this._armor) {
		speed += this._armor.getSpeed();
		count++;
	}

	return speed/count;
}

Game.Being.prototype.getDefenseSpeed = function() {
	var speed = this._speed;
	var count = 1;
	
	if (this._armor) {
		speed += this._armor.getSpeed();
		count++;
	}

	return speed/count;
}

Game.Being.prototype.getSpeed = function() {
	return this.getDefenseSpeed();
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
	if (hostile) {
		this._tasks.push("attack");
	} else {
		var index = this._tasks.indexOf("attack");
		this._tasks.splice(index, 1);
	}
	return this;
}

Game.Being.prototype.chat = function(being) {
	this._chattedWith = true;
	/* FIXME proper formatting */
	
	if (this._chats) {
		response = "%He responds: \"%s\"".format(this, this._chats.random());
	} else {
		response = "No response."
	}
	Game.status.show(response);
	
	return this;
}

Game.Being.prototype.chattedWith = function() {
	return this._chattedWith;
}

Game.Being.prototype.getChats = function() {
	return this._chats;
}

Game.Being.prototype.setChats = function(chats) {
	this._chats = chats;
	this._chattedWith = false;
	return this;
}

Game.Being.prototype.getDamage = function() {
	return this._damage + (this._weapon ? this._weapon.getDamage() : 0);
}

Game.Being.prototype.getPV = function() {
	return this._pv + (this._armor ? this._armor.getPV() : 0);
}

Game.Being.prototype.getHP = function() {
	return this._hp;
}

Game.Being.prototype.getMaxHP = function() {
	return this._maxHP;
}

Game.Being.prototype.adjustHP = function(diff) {
	this._hp += diff;
	this._hp = Math.max(this._hp, 0);
	this._hp = Math.min(this._hp, this._maxHP);
	if (!this._hp) { this.die(); }
	return this;
}

Game.Being.prototype.getWeapon = function() {
	return this._weapon;
}

Game.Being.prototype.attack = function(target) {
	/* FIXME probably refactor to a dedicated attack logic? */

	/* 1. hit? */
//	console.log("hit", this.getAttackSpeed(), "+5", "vs", target.getDefenseSpeed());
	var speed1 = this.getAttackSpeed() + ROT.RNG.getNormal(5, 5); /* attacker advantage */
	var speed2 = target.getDefenseSpeed() + ROT.RNG.getNormal(0, 5);

	/* 1a. miss */
	if (speed1 < speed2) {
		Game.status.show("%The %{verb,miss} %the.".format(this, this, target));
		return; 
	}

	/* 1b. hit */
	var dmg = this.getDamage() + ROT.RNG.getNormal(0, 1);
	var pv = target.getPV() + ROT.RNG.getNormal(0, 1);
//	console.log("dmg", this.getDamage(), "vs", target.getPV());
	dmg = Math.round(dmg-pv);

	/* 2a. not enough damage */
	if (dmg <= 0) {
		Game.status.show("%The %{verb,fail} to hurt %the.".format(this, this, target));
		return;
	}

	/* 2b. damage */
//	console.log("dmg dealt", dmg);
	target.adjustHP(-dmg);	
	var str = "%The %{verb,hit} %the".format(this, this, target);
	var ratio = target.getHP() / target.getMaxHP();
	if (ratio > 0) {
		var types = ["slightly", "moderately", "severly", "critically"].reverse();
		var type = types[Math.ceil(ratio*types.length)-1];
		str += " and %s %{verb,wound} %him.".format(type, this, target);
	} else {
		this._kills++;
		str += " and %{verb,kill} %him.".format(this, target);
	}
	Game.status.show(str);
}

Game.Being.prototype.die = function() {
	if (!this._level.items[this._position.join(",")]) { 
		var corpse = Game.Items.create("corpse", {color:this._diffuse, name:this._name+" corpse"});
		this._level.setItem(corpse, this._position[0], this._position[1]);
	}
	this._level.removeBeing(this);
	Game.engine.removeActor(this);
	return this;
}

Game.Being.prototype.describeVerb = function(verb) {
	return verb + (verb.charAt(verb.length-1) == "s" ? "e" : "") + "s";
}

Game.Being.prototype.describeHim = function() {
	return ["it", "him", "her"][this._sex];
}

Game.Being.prototype.describeHe = function() {
	return ["it", "he", "she"][this._sex];
}
