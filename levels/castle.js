Game.Level.Castle = function() {
	Game.Level.call(this);
	this._ambientLight = [130, 130, 130];

	this._phase = 0;
}
Game.Level.Castle.extend(Game.Level);
