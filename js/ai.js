Game.AI = function(being) {
	this._being = being;
}

Game.AI.prototype.act = function() {
	var tasks = this._being.getTasks();
	var i = tasks.length;
	if (!i) { return; }

	while (i--) {
		var result = this._performTask(tasks[i]);
		if (result) { return; }
	}
}

/**
 * @returns {bool} Successfull
 */
Game.AI.prototype._performTask = function(task) {
	switch (task) {
		case "wander":
			return this._wander();
		break;
		default: 
			throw new Error("Unknown task '"+task+"'");
		break;
	}
	
}

Game.AI.prototype._wander = function() {
	var level = this._being.getLevel();
	var pos = this._being.getPosition();
	var dirs = ROT.DIRS[8];
	var avail = [];
	
	for (var i=0;i<dirs.length;i++) {
		var x = pos[0]+dirs[i][0];
		var y = pos[1]+dirs[i][1];
		if (this._isPassable(level, x, y)) { avail.push(dirs[i]); }
	}
	
	if (avail.length) {
		var dir = avail.random();
		var x = pos[0]+dir[0];
		var y = pos[1]+dir[1];
		level.setBeing(this._being, x, y);
	}
	return true;
}

Game.AI.prototype._isPassable = function(level, x, y) {
	var key = x+","+y;
	if (key in level.beings) { return false; }
	
	var cell = level.cells[key];
	if (!cell) { return false; }
	
	return !cell.blocksMovement();
}
