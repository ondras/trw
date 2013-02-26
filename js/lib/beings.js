Game.Beings.define("player", {
	extend: "humanoid",
	pv: 3,
	hp: 10,
	damage: 3,
	ctor: Game.Player,
	color: [200, 200, 200]
}, {
	weight: 0
});

Game.Beings.define("guard", {
	extend: "humanoid",
	name: "guard",
	tasks: [],
	color: [220, 140, 140]
}, {
	weight: 0
});

Game.Beings.define("jester", {
	extend: "humanoid",
	chats: ["There is a secret passage to the kitchen, hidden in the throne room. But only the King shall know about it!"],
	name: "jester",
	color: [240, 100, 100]
}, {
	weight: 0
});

Game.Beings.define("gardener", {
	extend: "humanoid",
	name: "gardener",
	chats: ["Good day to you, sir!", "Watch these flowers blossom!", "This garden needs my attention."],
	color: [100, 240, 100],
}, {
	weight: 0
});

Game.Beings.define("bride", {
	extend: "humanoid",
	ctor: Game.Being.Bride,
	tasks: [],
	name: "bride",
	color: [240, 240, 240]
}, {
	weight: 0
});

Game.Beings.define("groom", {
	extend: "humanoid",
	tasks: [],
	name: "groom",
	color: [80, 80, 80]
}, {
	weight: 0
});

Game.Beings.define("guest", {
	extend: "humanoid",
	tasks: ["slowwander"],
	name: "wedding guest",
	color: [140, 140, 140],
	colorVariation: [30, 30, 30]
}, {
	weight: 0
});

Game.Beings.define("priest", {
	extend: "humanoid",
	tasks: [],
	chats: ["You would like to talk to the bride - and you brought her nothing? Shame on you!"],
	name: "priest",
	color: [200, 30, 200]
}, {
	weight: 0
});
