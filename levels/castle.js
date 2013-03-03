Game.Level.Castle = function() {
	Game.Level.call(this);

	this._lighting.setOptions({range:8});
	this._playerLight = [30, 30, 30];
	
	this._gates = [];
	this._guards = [];
	this._jester = null;
	this._gardener = null;
	this._rats = [];
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
		if (being.getType() == "jester") { this._jester = being; }
		if (being.getType() == "rat") { this._rats.push(being); }
		if (being.getType() == "gardener") { this._gardener = being; }
	}

	this._initStory();
	return this;
}

Game.Level.Castle.prototype._initStory = function() {
	this._addRule(function() {
		return true;
	}, function() {
		Game.storyFlags.nightEnded = true;
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
		for (var i=0;i<this._gates.length;i++) { this._gates[i].open(); }
		return true;
	});
	
	this._addRule(function() {
		var key = Game.player.getPosition().join(",");
		return (this.cells[key].getId() == "entry");
	}, function() {
		Game.story.newChapter("Here I am! Unfortunately, the castle seems to be rather quiet. I am late to the wedding, so maybe people are already in the chapel. I shall make my way further through the throne room.");
		return true;
	});
	
	this._addRule(function() {
		var key = Game.player.getPosition().join(",");
		return (this.cells[key].getId() == "throneroom");
	}, function() {
		Game.story.newChapter("The throne room is empty as well. How am I supposed to get into the chapel through all those locked doors? Perhaps that funny jester will provide an answer.");
		return true;
	});

	this._addRule(function() {
		var key = Game.player.getPosition().join(",");
		return (this.cells[key].getId() == "throne" && this._jester.chattedWith());
	}, function() {
		Game.status.show("As you sit on the throne, the jester exclaims: \"The King! We have a King! Look how mighty he looks on his throne! He surely knows about that secret passage in the southern wall.\"");
		this._jester.setChats(["Howdy! How is your majesty today?"]);

		var pos = this.getCellById("secretdoor").getPosition();
		var door = Game.Cells.create("door", {name:"secret door", "closed":1});
		this.setCell(door, pos[0], pos[1]);
		return true;
	});

	this._addRule(function() {
		var key = Game.player.getPosition().join(",");
		return (this.cells[key].getId() == "armory");
	}, function() {
		Game.story.newChapter("I managed to advance deeper into the castle by following that jester's advice. The kitchen is close, but I hear some squeaking sounds from inside. Perhaps I should arm myself in this little armory nearby.");
		return true;
	});

	this._addRule(function() {
		var key = Game.player.getPosition().join(",");
		return (this.cells[key].getId() == "kitchen");
	}, function() {
		Game.story.newChapter("Indeed! There are some nasty (and hungry) rats in the kitchen. Slaughtering them should be an easy combat excercise.");
		Game.story.setTask("Kill all the rats.");
		return true;
	});

	this._addRule(function() {
		for (var i=0;i<this._rats.length;i++) {
			if (this._rats[i].getHP() > 0) { return false; }
		}
		return true;
	}, function() {
		Game.story.newChapter("Me versus rats – 3:0. Nice. Now let's get to that chapel before the wedding is over!");
		return true;
	});

	this._addRule(function() {
		return Game.storyFlags.wantsFlower;
	}, function() {
		this.removeBeing(this._gardener);
		Game.engine.removeActor(this._gardener);
		return true;
	});

	this._addRule(function() {
		return Game.storyFlags.gardenerDead;
	}, function() {
		var pos = this.getCellById("potion").getPosition();
		var potion = Game.Items.create("healing-potion");
		this.setItem(potion, pos[0], pos[1]);
		
		this._jester.setChats(["Her majesty just left the castle! Who knows where she might have been heading? I do not!"]);

		var guardChat = ["Her majesty told us that you entered the wedding and murdered her husband! Prepare to die, traitor!"];
		for (var i=0;i<this._guards.length;i++) {
			this._guards[i].setChats(guardChat);
		}
		
		var pos = this.getCellById("bridge").getPosition();
		this.setBeing(this._guards[0], pos[0], pos[1]);

		return true;
	});

	this._addRule(function() {
		return (Game.storyFlags.gardenerDead && this._jester.chattedWith());
	}, function() {
		Game.story.addChapter("My prime suspect - her majesty - has left the castle. If I hurry, I might be able to catch her before she reaches the harbor.");
		Game.story.setTask("Follow the bride through the castle and the forest.");

		return true;
	});

	this._addRule(function() {
		if (!Game.storyFlags.gardenerDead) { return false; }
		for (var i=0;i<this._guards.length;i++) {
			if (this._guards[i].chattedWith()) { return true; }
		}
		return false;
	}, function() {
		for (var i=0;i<this._guards.length;i++) { this._guards[i].setHostile(true); }
		return true;
	});

}

Game.Level.Castle.prototype._welcomeBeing = function(being) {
	Game.Level.prototype._welcomeBeing.call(this, being);
	if (being == Game.player) { being.setLight(this._playerLight); }
}
