Game.Level.Dungeon = function(depth) {
	/* FIXME player light */
	Game.Level.call(this);
	this._depth = depth;

	this._rooms = [];
	this._build();
	if (depth == 1) { this._initStory(); }
}
Game.Level.Dungeon.extend(Game.Level);

Game.Level.Dungeon.prototype._build = function() {
	var w = 60, h = 30;
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
	this._buildDoors();
	/*
	this._buildItems();
	this._buildBeings();
*/
	this.setSize(w, h);
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
			}

		}
	}

	var center = this._rooms[0].getCenter();
	var startCell = Game.Cells.create("staircase-up");
	this.setCell(startCell, center[0], center[1]);
	this.cells[(center[0]+1) + "," + center[1]].setId("start");

	var center = this._rooms[this._rooms.length-1].getCenter();
	var endCell = Game.Cells.create("staircase-down");
	this.setCell(endCell, center[0], center[1]);
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
	var beingCount = 3 + Math.floor(ROT.RNG.getUniform() * 5);
	for (var i=0;i<beingCount;i++) {
		var being = Game.Beings.create();
		var pos = cells[i].getPosition();
		this.setBeing(being, pos[0], pos[1]);
	}
}

Game.Level.Dungeon.prototype._initStory = function() {
	this._addRule(function() {
		return true;
	}, function() {
		Game.story.newChapter("I finally arrived at the Dungeon. By this time the wedding ceremony is probably already over, so I should at least get in and give my congratulations. I guess a lot of people are attending...");
		
		return true; /* remove from rule list */
	});
}
