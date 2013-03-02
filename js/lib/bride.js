Game.Being.Bride = function(type) {
	Game.Being.call(this, type);
}
Game.Being.Bride.extend(Game.Being);

Game.Being.Bride.prototype.chat = function(being) {
	Game.status.show("%He sits in the corner and sobs quietly.".format(this));
}

Game.Being.Bride.prototype.getSpeed = function() {
	return Game.player.getSpeed();
}

Game.Being.Bride.prototype.describeA = Game.Being.Bride.prototype.describeThe;
