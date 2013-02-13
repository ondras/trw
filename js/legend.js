/**
 * Automatic legend area
 */
Game.Legend = function(node) {
	this._node = node;
}

Game.Legend.prototype.update = function(x, y) {
	var level = Game.level;
	var visibleArea = level.getVisibleArea();

	var R = 2; /* FIXME */
	var data = [];
	var fontSize = level.getFontSize();

	for (var dx = -R; dx <= R; dx++) {
		for (var dy = -R; dy <= R; dy++) {
			var key = (x + dx) + "," + (y + dy);
			if (!(key in visibleArea)) { continue; }

			var entity = level.beings[key] || level.items[key] || level.cells[key];
			if (!entity) { continue; }

			var dist = dx*dx+dy*dy;
			var description = entity.describe();
			var color = entity.getColor();
			color = color[0]+color[1]+color[2];
			var index = -1;

			for (var j=0;j<data.length;j++) {
				if (data[j].description == description) { index = j; }
			}
			if (index == -1) { 
				data.push({description:description, entity:entity, dist:dist, color:color});
			} else {
				data[index].dist = Math.min(data[index].dist, dist);
				if (color > data[index].color) { 
					data[index].color = color;
					data[index].entity = entity;
				} /* brighter color */
			} /* existing description */

		} /* for y */
	} /* for x */

	data.sort(function(a, b) {
		var diff = a.dist-b.dist;
		return (diff ? diff : a.description.localeCompare(b.description));
	});

	this._node.innerHTML = "";

	for (var i=0;i<data.length;i++) {
		var item = data[i];
		var item = this._buildItem(data[i].entity, fontSize);
		this._node.appendChild(item);
	}

}

Game.Legend.prototype._buildItem = function(entity, fontSize) {
	var node = document.createElement("p");
	var ch = document.createElement("span");
	ch.innerHTML = entity.getChar();
	ch.style.fontSize = fontSize + "px";1
	ch.style.color = ROT.Color.toRGB(entity.getColor());
	node.appendChild(ch);
	var span = document.createElement("span");
	span.innerHTML = " " + entity.describe();
	node.appendChild(span);
	return node;
}