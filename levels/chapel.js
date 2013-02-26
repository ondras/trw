Game.Level.Chapel = function() {
	/* FIXME druhy blocker krom priesta; konverzace guestu a priesta */
	Game.Level.call(this);

	this._lighting.setOptions({range:8});

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
		return true;
	});
}

Game.Level.Chapel.prototype._murderGroom = function() {
	var pos = this._groom.getPosition();
	this._groom.die(); /* :-/ */
	
	for (var i=0;i<ROT.DIRS[8].length;i++) {
		var x = pos[0] + ROT.DIRS[8][i][0];
		var y = pos[1] + ROT.DIRS[8][i][1];
		var item = this.items[x+","+y];
		if (!item && ROT.RNG.getUniform() > 0.5) {
			this.setCell(Game.Cells.create("blood"), x, y);
		}
	}
	
	var pos = this.getCellById("window").getPosition();
	this.setCell(Game.Cells.create("floor"), pos[0], pos[1]);
	
	var pos = this.getCellById("exit").getPosition();
	var staircase = Game.Cells.create("staircase-down", {id:"dungeon"});
	this.setCell(staircase, pos[0], pos[1]);
	
	var dungeon = new Game.Level.Dungeon(1, this, "from-dungeon");
	
	this._portals["dungeon"] = {
		level: dungeon,
		direction: "fade"
	};
	
	for (var i=0;i<this._guests.length;i++) {
		var guest = this._guests[i];
		guest.setTasks(["wander"]);
	}
	
	var pos = this.getCellById("bride").getPosition();
	this.setBeing(this._bride, pos[0], pos[1]);

}
