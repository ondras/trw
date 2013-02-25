Game.Level.Dungeon = function(depth) {
	Game.Level.call(this);
	this._depth = depth;

	this._rooms = [];
	this._build();
	if (depth == 3) { this._initStory(); }

}
Game.Level.Dungeon.extend(Game.Level);

Game.Level.Dungeon.prototype._build = function() {
	var generator = new ROT.Map.Uniform(60, 30);
	
	var callback = function(x, y, type) {
		var cell = Game.Cells.create(type == 1 ? "stonewall" : "floor");
		this.setCell(cell, x, y);
	}
	generator.create(callback.bind(this));
	this._rooms = generator.getRooms();
	
	var center = this._rooms[0].getCenter();
	this.cells[center.join(",")].setId("start");
}

Game.Level.Dungeon.prototype._initStory = function() {
	this._addRule(function() {
		return true;
	}, function() {
		Game.story.newChapter("I finally arrived at the Dungeon. By this time the wedding ceremony is probably already over, so I should at least get in and give my congratulations. I guess a lot of people are attending...");
		
		/* FIMXE player light */
		return true; /* remove from rule list */
	});
}
