Game.Beings.define("player", {
	extend: "humanoid",
	"char": "@",
	pv: 0*3,
	hp: 0*10,
	damage: 0*3,
	ctor: Game.Player,
	color: [200, 200, 200]
});

Game.Beings.define("guard", {
	extend: "humanoid",
	name: "guard",
	"char": "G",
	tasks: [],
	color: [220, 140, 140]
});

Game.Beings.define("jester", {
	extend: "humanoid",
	"char": "J",
	ctor: Game.Being.Jester,
	name: "jester",
	color: [240, 100, 100]
});

Game.Beings.define("gardener", {
	extend: "humanoid",
	"char": "G",
	name: "gardener",
	chats: ["Good day to you, sir!", "Watch these flowers blossom!", "This garden needs my attention."],
	color: [100, 240, 100],
});
