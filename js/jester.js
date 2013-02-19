Game.Being.Jester = function(type) {
	Game.Being.call(this, type);

	this._chats = ["There is a secret passage to the kitchen, hidden in the throne room. But only the King shall know about it!"];
}
Game.Being.Jester.extend(Game.Being);

