Game.Display = function(options) {
	var o = options || {};
	o.layout = "rectCursor";
	ROT.Display.call(this, o);
	this._cursor = "";
}
Game.Display.extend(ROT.Display);

Game.Display.prototype.setCursor = function(x, y) {
	this._cursor = x+","+y;
}

Game.Display.prototype._draw = function(key, clearBefore) {
	ROT.Display.prototype._draw.call(this, key, clearBefore);
	if (key == this._cursor) { 
		var parts = this._cursor.split(",");
		this._backend.drawCursor(parseInt(parts[0]), parseInt(parts[1]), this._data[key][3]); 
	}
}

ROT.Display.RectCursor = function(context) {
	ROT.Display.Rect.call(this, context);
}
ROT.Display.RectCursor.extend(ROT.Display.Rect);

ROT.Display.RectCursor.prototype.drawCursor = function(x, y, color) {
	var height = Math.round(this._spacingY / 10);
	this._context.fillStyle = color;
	this._context.fillRect(x*this._spacingX, (y+1)*this._spacingY - height, this._spacingX, height);
}
