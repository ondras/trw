Game.Level.Dungeon = function(depth, previousLevel, previousCell) {
	Game.Level.call(this);
	this._depth = depth;
	this._maxDepth = 3;
	this._gardener = null;
	if (this._depth == this._maxDepth) { 
		this._gardener = Game.Beings.create("gardener"); 
		this._gardener.setChats(["Okay, so I murdered him. But it wasn't my idea! She promised me gold if I do it!"]);
	}
	this._playerLight = [140, 110, 60];

	this._rooms = [];
	this._build(previousLevel, previousCell);
	this._initStory();
}
Game.Level.Dungeon.extend(Game.Level);

Game.Level.Dungeon.prototype._build = function(previousLevel, previousCell) {
	var w = 60, h = 26;
	var generator = new ROT.Map.Uniform(w, h);

	var bitMap = [];
	for (var i=0;i<w;i++) { bitMap[i] = []; }
	generator.create(function(x, y, type) { 
		bitMap[x][y] = type;
	});
	this._rooms = generator.getRooms();

	var diffx = (ROT.RNG.getUniform() > 0.5 ? 1 : -1);
	var diffy = (ROT.RNG.getUniform() > 0.5 ? 1 : -1);
	var sort = function(a, b) {
		var ca = a.getCenter();
		var cb = b.getCenter();
		var dx = (ca[0]-cb[0]) * diffx;
		var dy = (ca[1]-cb[1]) * diffy;
		return dx+dy;
	}
	this._rooms.sort(sort);

	this._buildFromBitMap(bitMap, w, h);
	this._buildStaircases(previousLevel, previousCell);
	this._buildDoors();
	this._buildItems();
	this._buildBeings();
	this.setSize(w, h);
}

Game.Level.Dungeon.prototype._buildStaircases = function(previousLevel, previousCell) {
	var center = this._rooms[0].getCenter();
	var startCell = Game.Cells.create("staircase-up", {id: "previous"});
	this.setCell(startCell, center[0], center[1]);
	this._portals["previous"] = {
		level: previousLevel,
		cell: previousCell
	}

	this.cells[(center[0]-1) + "," + center[1]].setId("start");

	var center = this._rooms[this._rooms.length-1].getCenter();
	if (this._depth == this._maxDepth) {
		this.setBeing(this._gardener, center[0], center[1]);
	} else {
		var endCell = Game.Cells.create("staircase-down", {id: "exit"});
		this.setCell(endCell, center[0], center[1]);
		this.cells[(center[0]-1) + "," + center[1]].setId("from-dungeon");
	}
}

Game.Level.Dungeon.prototype._buildFromBitMap = function(bitMap, w, h) {
	for (var i=0;i<w;i++) {
		for (var j=0;j<h;j++) {
			var value = bitMap[i][j];

			switch (value) {
				case 0:
					var floor = Game.Cells.create("floor");
					this.setCell(floor, i, j);
				break;

				case 1:
					var neighborCount = this._getNeighborCount(bitMap, i, j, 0);
					if (neighborCount > 0) {
						var wall = Game.Cells.create("stonewall");
						this.setCell(wall, i, j);
					}
				break;
			} /* switch */
		}
	}
}

Game.Level.Dungeon.prototype._getNeighborCount = function(bitMap, x, y, value) {
	var result = 0;

	for (var dx=-1; dx<=1; dx++) {
		for (var dy=-1; dy<=1; dy++) {
			if (!dx && !dy) { continue; }
			var i = x+dx;
			var j = y+dy;
			if (!bitMap[i]) { continue; }
			if (bitMap[i][j] === value) { result++; }
		}
	}

	return result;
}

Game.Level.Dungeon.prototype._buildDoors = function() {
	var callback = function(x, y) {
		var door = Game.Cells.create("door", {closed: ROT.RNG.getUniform() > 0.5});
		this.setCell(door, x, y);
	}
	for (var i=0;i<this._rooms.length;i++) {
		this._rooms[i].getDoors(callback.bind(this));
	}
}

Game.Level.Dungeon.prototype._buildBeings = function() {
	var cells = this._getFreeCells().randomize();
	var beingCount = 3 + Math.floor(ROT.RNG.getUniform() * 3);
	for (var i=0;i<beingCount;i++) {
		var being = Game.Beings.createRandom({level:this._depth}).setHostile(true);
		var pos = cells[i].getPosition();
		this.setBeing(being, pos[0], pos[1]);
	}
}

Game.Level.Dungeon.prototype._buildItems = function() {
	var cells = this._getFreeCells().randomize();
	var itemCount = 3 + Math.floor(ROT.RNG.getUniform() * 3);
	for (var i=0;i<itemCount;i++) {
		var item = Game.Items.createRandom();
		var pos = cells[i].getPosition();
		this.setItem(item, pos[0], pos[1]);
	}
}

Game.Level.Dungeon.prototype._getFreeCells = function() {
	var result = [];
	for (var key in this.cells) {
		var cell = this.cells[key];
		if (cell.getType() == "floor" && !this.items[key] && !this.beings[key]) { result.push(cell); }
	}
	return result;
}

Game.Level.Dungeon.prototype._initStory = function() {
	if (this._depth == 1) {
		this._addRule(function() {
			return true;
		}, function() {
			Game.story.newChapter("A castle dungeon, right. I guess it just won't work without a dungeon. Narrow corridors, rotten smell in the air, poor visibility. Just you wait, murderer, I'm coming!");
			Game.story.setTask("Make your way through the dungeon and find the assassin.");
			return true; /* remove from rule list */
		});
	}
	
	if (this._depth == this._maxDepth) {

		this._addRule(function() {
			return this._gardener.chattedWith();
		}, function() {
			this._gardener.setHostile(true);
			return true;
		});

		this._addRule(function() {
			return !this._gardener.getHP();
		}, function() {
			Game.storyFlags.gardenerDead = true;
			Game.story.newChapter("The gardener lies dead. Looks like the groom is avenged now. But my task is far from being over: if the gardener spoke truth, there is someone else behind this - and I have a feeling that I know who.");
			Game.story.setTask("Get back to the castle and find the bride.");
			return true;
		});
	} else {

		this._addRule(function() {
			var key = Game.player.getPosition().join(",");
			return (this.cells[key].getId() == "exit");
		}, function() {
			var dungeon = new Game.Level.Dungeon(this._depth+1, this, "from-dungeon");
			this._portals["exit"] = {
				level: dungeon,
				direction: "fade"
			};
			this._enterPortal("exit");
			return true;
		});

	}
}

Game.Level.Dungeon.prototype._welcomeBeing = function(being) {
	Game.Level.prototype._welcomeBeing.call(this, being);
	if (being == Game.player) { being.setLight(this._playerLight); }
}
