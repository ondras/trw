Game.Level.Forest = function() {
	Game.Level.call(this);
	this._lighting.setOptions({range:6});
}
Game.Level.Forest.extend(Game.Level);

Game.Level.Forest.prototype.fromTemplate = function(map, def) {
	this._minMaze = [Infinity, Infinity];
	this._maxMaze = [-Infinity, -Infinity];
	Game.Level.prototype.fromTemplate.call(this, map, def);

	/* postprocess by inserting a maze */
	var width = this._maxMaze[0]-this._minMaze[0]+1;
	var height = this._maxMaze[1]-this._minMaze[1]+1;
	var maze = new ROT.Map.EllerMaze(width, height);
	maze.create(function(x, y, type) {
		var cellType = (type == 1 ? "tree" : "ground");
		var cell = Game.Cells.create(cellType);
		this.setCell(cell, x+this._minMaze[0], y+this._minMaze[1]);
	}.bind(this));

	var entry = this.getCellById("maze1").getPosition();
	this.setCell(Game.Cells.create("ground"), entry[0]+1, entry[1]);

	var exit = this.getCellById("maze2").getPosition();
	this.setCell(Game.Cells.create("ground"), exit[0]-1, exit[1]);

	var gold = Game.Items.create("secret-gold");
	this.setItem(gold, this._minMaze[0]+1, this._minMaze[1]+1);
	
	this._initStory();

	return this;
}

Game.Level.Forest.prototype._fromChar = function(x, y, ch, def) {
	if (ch == "?") {
		this._minMaze[0] = Math.min(this._minMaze[0], x);
		this._minMaze[1] = Math.min(this._minMaze[1], y);
		this._maxMaze[0] = Math.max(this._minMaze[0], x);
		this._maxMaze[1] = Math.max(this._minMaze[1], y);
		return;
	}

	return Game.Level.prototype._fromChar.call(this, x, y, ch, def);
}

Game.Level.Forest.prototype._initStory = function() {
	this._addRule(function() {
		return true;
	}, function() {
		Game.story.newChapter("Cool! I have been invited to attend a royal wedding! It is early in the morning, I just left my ship and the sky is still dark. I will have to find a way to the castle before the wedding starts.");
		return true; /* remove from rule list */
	});

	this._addRule(function() {
		var key = Game.player.getPosition().join(",");
		return (this.cells[key].getId() == "1");
	}, function() {
		Game.story.addChapter("Damn, it is dark in here. I should find some fire to light my own torch.");
		Game.story.setTask("Move onto a place with a lit torch.");
		return true;
	});
	
	this._addRule(function() {
		var key = Game.player.getPosition().join(",");
		return (!Game.storyFlags.nightEnded && this.cells[key].getType() == "torch");
	}, function() {
		this._story.hasTorch = true;
		Game.player.setLight([150, 150, 80]);
		Game.story.newChapter("This torch is my only light source. Hopefully it will last long enough until I find my way to the royal castle through this forest.");
		Game.story.setTask("Make your way through the forest.");
		return true;
	});

	this._addRule(function() {
		var x = Game.player.getPosition()[0];
		return (x > (this._minMaze[0]+this._maxMaze[0])/2);
	}, function() {
		Game.story.addChapter("Navigating through this complex forest maze is taking longer than I expected. If I do not hurry, I will miss the wedding!");
		return true;
	});

	this._addRule(function() {
		return (Game.storyFlags.nightEnded);
	}, function() {
		this._ambientLight = [130, 130, 130];
		this._lighting.setOptions({range:8});
		this._sightRange = 10;
		Game.player.setSightRange(this._sightRange);
		return true;
	});

	this._addRule(function() {
		return (Game.storyFlags.gardenerDead);
	}, function() {
		var bride = Game.Beings.create("bride");
		bride.setTasks(["escape"]);
		var pos = this.getCellById("maze2").getPosition();
		
		this.setBeing(bride, pos[0]-2, pos[1]);
		Game.engine.addActor(bride);

		return true;
	});
}
