Game.Beings.define("player", {
	extend: "humanoid",
	pv: 2,
	hp: 20,
	damage: 2,
	ctor: Game.Player,
	color: [200, 200, 200]
}, {
	weight: 0
});

Game.Beings.define("guard", {
	extend: "humanoid",
	name: "guard",
	speed: 110,
	damage: 2.5,
	hp: 3,
	sex: 1,
	tasks: [],
	color: [220, 140, 140]
}, {
	weight: 0
});

Game.Beings.define("jester", {
	extend: "humanoid",
	chats: ["There is a secret passage to the kitchen, hidden in the throne room. But only the King shall know about it!"],
	name: "jester",
	sex: 1,
	color: [240, 100, 100]
}, {
	weight: 0
});

Game.Beings.define("gardener", {
	extend: "humanoid",
	name: "gardener",
	sex: 1,
	hp: 3,
	speed: 115,
	damage: 3,
	chats: ["Good day to you, sir!", "Watch these flowers blossom!", "This garden needs my attention."],
	color: [100, 240, 100],
}, {
	weight: 0
});

Game.Beings.define("bride", {
	extend: "humanoid",
	ctor: Game.Being.Bride,
	sex: 2,
	tasks: [],
	name: "bride",
	color: [255, 255, 255]
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
	chats: ["What a wonderful wedding!", "You should definitely see the bride and the groom.", "Nice weather, isn't it?", "Most delighted by meeting you."],
	name: "wedding guest",
	sex: [1, 2],
	color: [140, 140, 140],
	colorVariation: [30, 30, 30]
}, {
	weight: 0
});

Game.Beings.define("priest", {
	extend: "humanoid",
	tasks: [],
	chats: ["You want to talk to the bride - and you brought her nothing? Shame on you!"],
	sex: 1,
	name: "priest",
	color: [200, 30, 200]
}, {
	weight: 0
});
