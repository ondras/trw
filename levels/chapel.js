Game.Level.Chapel = function() {
	/* FIXME druhy blocker krom priesta; konverzace a AI guestu */
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
		this._groom.die(); /* :-/ */
		
		var pos = this.getCellById("window").getPosition();
		var floor = Game.Cells.create("floor");
		this.setCell(floor, pos[0], pos[1]);
		
		var pos = this.getCellById("exit").getPosition();
		var staircase = Game.Cells.create("staircase-down");
		this.setCell(staircase, pos[0], pos[1]);
		

		return true;
	});
}
