Game.Description = function() {
	this._boringCellTypes = ["stonewall", "floor", "path"];

	this._dom = {
		local: document.querySelector("#description #local"),
		inventory: document.querySelector("#description #inventory"),
		action: document.querySelector("#description #action")
	}
}

Game.Description.prototype.local = function() {
	var phrases = [];

	var position = Game.player.getPosition();

	var current = this._localCell(position);
	if (current) { phrases.push(current); }

	var cells = this._localCells(position);
	if (cells) { phrases.push(cells); }

	var itemsAndBeings = this._localItemsAndBeings(position);
	if (itemsAndBeings) { phrases.push(itemsAndBeings); }

	this._dom.local.innerHTML = phrases.join(" ");
}

Game.Description.prototype.inventory = function() {

}

Game.Description.prototype.action = function() {

}

Game.Description.prototype._localCell = function(position) {
	var key = position.join(",");
	var cell = Game.level.cells[key];

	var cellStr = "";
	if (this._boringCellTypes.indexOf(cell.getType()) == -1) {
		cellStr = "you are standing on " + cell.describeA();
	}

	var itemStr = "";
	var item = Game.level.items[key];
	if (item) {
		itemStr = item.describeA() + " is here";
	}

	if (!cellStr && !itemStr) { return ""; }

	var result = (cellStr || itemStr).capitalize();
	if (cellStr && itemStr) { result += "; " + itemStr; }
	return result + ".";
}

Game.Description.prototype._localCells = function(position) {
	var key = position.join(",");
	var centerType = Game.level.cells[key].getType();

	var data = []; /* each record: count, cell, description */

	var dirs = ROT.DIRS[8];
	for (var i=0;i<dirs.length;i++) {
		var x = position[0] + dirs[i][0];
		var y = position[1] + dirs[i][1];
		key = x+","+y;
		var cell = Game.level.cells[key];
		var type = cell.getType();
		if (type == centerType || this._boringCellTypes.indexOf(type) != -1) { continue; }

		var description = cell.describe();
		var index = -1;
		for (var j=0;j<data.length;j++) {
			if (data[j].description == description) { index = j; }
		}
		if (index == -1) {
			index = data.length;
			data.push({description:description, count:0, cell:cell});
		}
		data[index].count++;
	}

	data.sort(function(a, b) {
		return b.count-a.count;
	});

	var parts = [];
	for (var i=0;i<data.length;i++) {
		parts.push(this._localCellType(data[i]));
	}

	return parts.join("FIXME");
}

Game.Description.prototype._localCellType = function(data) {

	/* 8 = completely surrounded */
	/* 7 = surrounded + */
	/* 6 = almost surrounded */

}

Game.Description.prototype._localItemsAndBeings = function(position) {
	
}
