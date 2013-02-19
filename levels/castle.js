Game.Level.Castle = function() {
	Game.Level.call(this);

	this._lighting.setOptions({range:8});
	this._sightRange = 10;
	this._ambientLight = [220, 220, 180];
	
	this._gates = [];
	this._guards = [];
}
Game.Level.Castle.extend(Game.Level);

Game.Level.Castle.prototype.fromTemplate = function(map, def) {
	Game.Level.prototype.fromTemplate.call(this, map, def);
	
	for (var key in this.cells) {
		var cell = this.cells[key];
		if (cell.getType() == "gate") { this._gates.push(cell); }
	}
	
	for (var key in this.beings) {
		var being = this.beings[key];
		if (being.getType() == "guard") { this._guards.push(being); }
	}

	this._initStory();
	return this;
}

Game.Level.Castle.prototype._initStory = function() {
	this._addRule(function() {
		return true;
	}, function() {
		Game.story.newChapter("The castle is in view. Getting inside should be pretty straightforward...");
		return true; /* remove from rule list */
	});
	
	this._addRule(function() {
		for (var i=0;i<this._gates.length;i++) {
			if (this._gates[i].bumpedInto()) { return true; }
		}
		return false;
	}, function() {
		Game.story.setTask("Talk to a gate guard.");
		return true;
	});

	this._addRule(function() {
		for (var i=0;i<this._guards.length;i++) {
			if (this._guards[i].chattedWith()) { return true; }
		}
		return false;
	}, function() {
		for (var i=0;i<this._gates.length;i++) {
			this._gates[i].open();
		}
		return true;
	});
	
	this._addRule(function() {
		var key = Game.player.getPosition().join(",");
		return (this.cells[key].getId() == "1");
	}, function() {
		Game.story.newChapter("Here I am! Unfortunately, the castle seems to be rather quiet. I am late to the wedding, so maybe people are already in the chapel. I shall make my way further through the throne room.");
		return true;
	});
	
	this._addRule(function() {
		var key = Game.player.getPosition().join(",");
		return (this.cells[key].getId() == "2");
	}, function() {
		Game.story.newChapter("The throne room is empty as well - and locked, too. How am I supposed to get into the chapel through all those locked doors? Perhaps that funny jester will provide an answer.");
		return true;
	});
}
