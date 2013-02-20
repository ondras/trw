Game.Beings.define("player", {
	extend: "humanoid",
	ctor: Game.Player,
	color: [200, 200, 200]
});

Game.Beings.define("guard", {
	extend: "humanoid",
	name: "guard",
	tasks: [],
	color: [220, 140, 140]
});

Game.Beings.define("jester", {
	extend: "humanoid",
	ctor: Game.Being.Jester,
	name: "jester",
	color: [240, 100, 100]
});

Game.Beings.define("gardener", {
	extend: "humanoid",
	name: "gardener",
	color: [100, 240, 100],
});
