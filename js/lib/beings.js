Game.Beings = new Game.Repository(Game.Being);

Game.Beings.define("player", {
	ctor: Game.Player,
	color: [200, 200, 200],
	ch: "@"
});

Game.Beings.define("orc", {
	ch: "o",
	color: [30, 240, 30]
});

Game.Beings.define("orc warlord", {
	extend: "orc",
	ch: "O"
});
