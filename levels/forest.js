Game.Level.Forest = function() {
	Game.Level.call(this);
	this._lighting.setOptions({range:6});
	this._ambientLight = [30, 30, 30];
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
		var cellType = (type == 1 ? "tree" : "path");
		var cell = Game.Cells.create(cellType);
		this.setCell(cell, x+this._minMaze[0], y+this._minMaze[1]);
	}.bind(this));

	var entry = this.getCellById("entry").getPosition();
	this.setCell(Game.Cells.create("path"), entry[0]+1, entry[1]);

	var exit = this.getCellById("exit").getPosition();
	this.setCell(Game.Cells.create("path"), exit[0]-1, exit[1]);

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

Game.Level.Forest.prototype.setBeing = function(being, x, y) {
	Game.Level.prototype.setBeing.call(this, being, x, y);
	
	if (being != Game.player) { return; }
	
	
	var item = this.items[x+","+y];
	if (item && item.getType() == "torch") { being.setLight([150, 150, 30]); }
	
	return this;
}

Game.Level.Forest.prototype.notify = function() {
	Game.story.newChapter("Cool! I have been invited to attend a royal wedding! It is early in the morning, I just left my ship and the sky is still dark. I will have to find a way to the castle before the wedding starts.");
	
	setTimeout(function() {
		Game.story.addChapter("Damn, it is dark in here. I should find some fire to light my own torch.");
		Game.story.setTask("Move onto a place with a lit torch");
	}, 2000);
/*
	this.story.setTask("pan cau neasi!");
	this.story.addChapter("xxxxxxx xxxxxxxxxxxx xxxxxxx xxxxxxxxxxxx xxxxxxx xxxxxxxxxxxx xxxxxxx xxxxxxxxxxxx xxxxxxx xxxxxxxxxxxx xxxxxxx xxxxxxxxxxxx xxxxxxx xxxxxxxxxxxx xxxxxxx xxxxxxxxxxxx xxxxxxx xxxxxxxxxxxx xxxxxxx xxxxxxxxxxxx ");
	this.story.addChapter("wqweqwe qe qewqew qew qweqwe qweqweweeqweqw qe qweqwe w w eeqw qw qwqwe qwqwe qweweq qw");
*/
}
