Game.Level.Chapel = function() {
	Game.Level.call(this);

	this._lighting.setOptions({range:8});
	this._playerLight = [30, 30, 30];

	this._priest = null;
	this._bride = null;
	this._groom = null;
	this._guests = [];
}
Game.Level.Chapel.extend(Game.Level);

Game.Level.Chapel.prototype.fromTemplate = function(map, def) {
	Game.Level.prototype.fromTemplate.call(this, map, def);
	
	for (var key in this.beings) {
		var being = this.beings[key];
		if (being.getType() == "guest") { this._guests.push(being); }
		if (being.getType() == "priest") { this._priest = being; }
		if (being.getType() == "bride") { this._bride = being; }
		if (being.getType() == "groom") { this._groom = being; }
	}
	
	this._initStory();
	return this;
}

Game.Level.Chapel.prototype._initStory = function() {
	this._addRule(function() {
		return true;
	}, function() {
		Game.story.newChapter("I finally arrived at the chapel. By this time the wedding ceremony is probably already over, so I should at least get in and give my congratulations. I guess a lot of people are attending...");
		return true; /* remove from rule list */
	});

	this._addRule(function() {
		return this._priest.chattedWith();
	}, function() {
		Game.story.addChapter("Indeed, it would be polite to bring some gift to the bride. I was in a hurry, so I brought nothing. Fortunately, I noticed some beautifully blossoming flowers in the castle garden.");
		Game.story.setTask("Get back to castle garden and bring a flower.");
		Game.storyFlags.wantsFlower = 1;
		return true;
	});

	this._addRule(function() {
		var weapon = Game.player.getWeapon();
		return (weapon && weapon.getType() == "flower");
	}, function() {
		this._murderGroom();
		Game.story.newChapter("I hear some unusual voices and screams from the chapel. What the hell is happening in there? I should investigate.");
		return true;
	});

	this._addRule(function() {
		return (Game.storyFlags.groomDead && this._priest.chattedWith());
	}, function() {
		Game.story.addChapter("I was away for only a few moments - and there was a crime committed, right next to the altar! The groom lies dead in a pool of blood; the assassin seems to have left the chapel through the window. I shall follow him.");
		Game.story.setTask("Follow the murderer.");
		return true;
	});

	this._addRule(function() {
		return Game.storyFlags.gardenerDead;
	}, function() {
		for (var key in this.cells) {
			var cell = this.cells[key];
			if (cell.getType() != "tombstone" || ROT.RNG.getUniform() > 0.3) { continue; }
			var undead = Game.Beings.createRandom({include:"undead"}).setHostile(true);
			var dir = Math.floor(ROT.RNG.getUniform()*8);
			var x = cell.getPosition()[0] + ROT.DIRS[8][dir][0];
			var y = cell.getPosition()[1] + ROT.DIRS[8][dir][1];
			this.setBeing(undead, x, y);
			Game.engine.addActor(undead);
		}
		this._priest.setChats(["You are looking for the bride? She went back to the castle. She was apparently in a hurry, strange."]);
		
		Game.engine.removeActor(this._bride);
		this.removeBeing(this._bride);
		return true;
	});
}

Game.Level.Chapel.prototype._murderGroom = function() {
	Game.storyFlags.groomDead = true;
	var pos = this._groom.getPosition();
	this._groom.die(); /* :-/ */
	
	for (var i=0;i<ROT.DIRS[8].length;i++) {
		var x = pos[0] + ROT.DIRS[8][i][0];
		var y = pos[1] + ROT.DIRS[8][i][1];
		var cell = this.cells[x+","+y];
		if (cell.getType() == "floor" && ROT.RNG.getUniform() > 0.5) {
			this.setCell(Game.Cells.create("blood"), x, y);
		}
	}
	
	var pos = this.getCellById("window").getPosition();
	this.setCell(Game.Cells.create("floor"), pos[0], pos[1]);
	
	var pos = this.getCellById("exit").getPosition();
	var staircase = Game.Cells.create("staircase-down", {id:"dungeon", name:"to the dungeon"});
	this.setCell(staircase, pos[0], pos[1]);
	
	var dungeon = new Game.Level.Dungeon(1, this, "from-dungeon");
	
	this._portals["dungeon"] = {
		level: dungeon,
		direction: "fade"
	};
	
	for (var i=0;i<this._guests.length;i++) {
		var guest = this._guests[i];
		guest.setTasks(["wander"]);
		guest.setChats(["Have you seen it? The groom has been stabbed!", "They say that the groom has been murdered!", "A hooded figure suddenly appeared and killed the groom!", "Oh my god oh my god!", "He jumped out right through that window!"]);
	}
	
	var pos = this._priest.getPosition();
	var x = pos[0]-2;
	var y = pos[1];
	var being = this.beings[x+","+y];
	if (being) {
		Game.engine.removeActor(being);
		this.removeBeing(being);
	}
	this.setBeing(this._priest, x, y);
	this._priest.setChats(["The groom is dead! His murderer jumped out of the chapel window; please try to follow him as fast as possible!"]);
	
	var pos = this.getCellById("bride").getPosition();
	this.setBeing(this._bride, pos[0], pos[1]);

}

Game.Level.Chapel.prototype._welcomeBeing = function(being) {
	Game.Level.prototype._welcomeBeing.call(this, being);
	if (being == Game.player) { being.setLight(this._playerLight); }
}
