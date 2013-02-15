Game.Level.Castle = function() {
	Game.Level.call(this);

	this._lighting.setOptions({range:8});
	this._sightRange = 10;
	this._ambientLight = [220, 220, 180];

	this._phase = 0;
}
Game.Level.Castle.extend(Game.Level);
