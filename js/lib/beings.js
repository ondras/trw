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
