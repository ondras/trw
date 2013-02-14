Game.Level.Castle = function() {
	Game.Level.call(this);

	this._lighting.setOptions({range:8});
	this._sightRange = 10;
	this._ambientLight = [150, 150, 130];

	this._phase = 0;
}
Game.Level.Castle.extend(Game.Level);
