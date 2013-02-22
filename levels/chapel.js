Game.Level.Chapel = function() {
	Game.Level.call(this);

	this._lighting.setOptions({range:8});
	this._sightRange = 10;
	this._ambientLight = [220, 220, 180];
}
Game.Level.Chapel.extend(Game.Level);

Game.Level.Chapel.prototype.fromTemplate = function(map, def) {
	Game.Level.prototype.fromTemplate.call(this, map, def);
	

	this._initStory();
	return this;
}

Game.Level.Chapel.prototype._initStory = function() {
	this._addRule(function() {
		return true;
	}, function() {
		Game.story.newChapter("I finally arrived at the chapel. By this time the wedding ceremony is probably already over, so I should at least get in and give my congratulations. I guess a lot of people are attending...");
		return true; /* remove from rule list */
	});
}
