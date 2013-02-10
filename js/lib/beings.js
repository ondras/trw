Game.Beings = new Game.Repository(Game.Being);

Game.Beings.define("player", {
	ctor: Game.Player,
	color: [200, 200, 200],
	"char": "@"
});

Game.Beings.define("orc", {
	"char": "o",
	color: [30, 240, 30]
});

Game.Beings.define("orc warlord", {
	extend: "orc",
	"char": "O"
});
