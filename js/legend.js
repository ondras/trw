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
	var dataObj = {};

	for (var dx = -R; dx <= R; dx++) {
		for (var dy = -R; dy <= R; dy++) {
			if (!dx && !dy) { continue; } 
			var key = (x + dx) + "," + (y + dy);
			if (!(key in visibleArea)) { continue; }

			var entity = level.beings[key] || level.items[key] || level.cells[key];
			if (!entity) { continue; }

			var dataKey = entity.getChar() + entity.describe();
			var color = entity.getColor();
			color = color[0]+color[1]+color[2];
			
			if (dataKey in dataObj) {
				if (color > dataObj[dataKey].color) {
					dataObj[dataKey].color = color;
					dataObj[dataKey].entity = entity;
				}
			} else {
				dataObj[dataKey] = {entity:entity, color:color};
			}

		} /* for y */
	} /* for x */

	var dataArr = [];
	for (var dataKey in dataObj) { dataArr.push(dataObj[dataKey]); }

	dataArr.sort(function(a, b) {
		return a.entity.describe().localeCompare(b.entity.describe());
	});

	var fontSize = level.getFontSize();
	this._node.style.fontSize = fontSize + "px";
	this._node.innerHTML = "<span>x</span>";
	var width = this._node.firstChild.offsetWidth;
	this._node.innerHTML = "";

	for (var i=0;i<dataArr.length;i++) {
		var item = this._buildItem(dataArr[i].entity, width * 22, Math.round(fontSize/1.3));
		this._node.appendChild(item);
	}
}

Game.Legend.prototype._buildItem = function(entity, width, labelSize) {
	var node = document.createElement("p");
	node.style.width = width+"px";
	var ch = document.createElement("span");
	ch.innerHTML = entity.getChar();
	ch.style.color = ROT.Color.toRGB(entity.getColor());
	node.appendChild(ch);
	var span = document.createElement("span");
	span.style.fontSize = labelSize + "px";
	span.innerHTML = " " + entity.describe();
	node.appendChild(span);
	return node;
}
