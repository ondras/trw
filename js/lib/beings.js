Game.Beings = new Game.Repository(Game.Being);

Game.Beings.define("animal", {
	tasks: ["wander"]
});

Game.Beings.define("humanoid", {
	"char": "@"
});

Game.Beings.define("player", {
	extend: "humanoid",
	ctor: Game.Player,
	color: [200, 200, 200]
});

Game.Beings.define("guard", {
	extend: "humanoid",
	name: "guard",
	color: [220, 140, 140]
});

Game.Beings.define("mugger", {
	extend: "humanoid",
	name: "mugger",
	color: [100, 240, 100]
});

Game.Beings.define("dog", {
	extend: "animal",
	name: "dog",
	color: [204, 204, 102],
	"char": "d"
});

Game.Beings.define("orc", {
	"char": "o",
	color: [30, 240, 30]
});

Game.Beings.define("orc warlord", {
	extend: "orc",
	"char": "O"
});
