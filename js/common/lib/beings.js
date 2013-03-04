Game.Beings = new Game.Repository(Game.Being);

Game.Beings.define("animal", {
	tasks: ["wander"]
}, {
	weight: 0
});

Game.Beings.define("humanoid", {
	tasks: ["wander"],
	"char": "@"
}, {
	weight: 0
});

Game.Beings.define("dog", {
	extend: "animal",
	name: "dog",
	hp: 2,
	color: [204, 204, 102],
	"char": "d"
});

Game.Beings.define("rat", {
	extend: "animal",
	speed: 105,
	name: "rat",
	color: [160, 160, 160],
	"char": "r"
});

Game.Beings.define("bat", {
	extend: "animal",
	name: "large bat",
	color: [160, 120, 30],
	"char": "B"
});

Game.Beings.define("mugger", {
	extend: "humanoid",
	name: "mugger",
	color: [160, 100, 100],
	chats: [
		"Help the poor!",
		"Have some spare gold?",
		"I am so hungry."
	]
}, {
	weight: 0
});

Game.Beings.define("orc", {
	"char": "o",
	name: "orc",
	hp: 3,
	damage: 2,
	extend: "humanoid",
	color: [30, 240, 30]
});

Game.Beings.define("goblin", {
	"char": "g",
	name: "goblin",
	hp: 2,
	damage: 2,
	extend: "humanoid",
	color: [30, 30, 240]
});

Game.Beings.define("kobold", {
	"char": "k",
	name: "kobold",
	hp: 2,
	damage: 2,
	extend: "humanoid",
	color: [30, 240, 30]
});

Game.Beings.define("orc chieftain", {
	extend: "orc",
	name: "orc chieftain",
	hp: 4,
	speed: 105,
	pv: 2,
	damage: 3,
	"char": "O"
}, {
	level: 2
});

Game.Beings.define("goblin chieftain", {
	extend: "goblin",
	name: "goblin chieftain",
	hp: 5,
	speed: 110,
	pv: 2,
	damage: 2,
	color: [30, 30, 160]
}, {
	level: 2
});

Game.Beings.define("undead", {
	tasks: ["wander"]
}, {
	weight: 0
});

Game.Beings.define("skeleton", {
	extend: "undead",
	name: "skeleton",
	hp: 2,
	damage: 2,
	speed: 100,
	"char": "s",
	color: [220, 220, 220]
}, {
	level: 2
});

Game.Beings.define("zombie", {
	extend: "undead",
	name: "zombie",
	hp: 2,
	speed: 100,
	damage: 2,
	"char": "z",
	color: [150, 200, 30]
}, {
	level: 2
});
