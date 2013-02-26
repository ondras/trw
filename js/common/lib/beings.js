Game.Beings = new Game.Repository(Game.Being);

Game.Beings.define("animal", {
	tasks: ["wander"]
}, {
	unique: true
});

Game.Beings.define("humanoid", {
	tasks: ["wander"],
	"char": "@"
}, {
	unique: true
});

Game.Beings.define("dog", {
	extend: "animal",
	name: "dog",
	color: [204, 204, 102],
	"char": "d"
});

Game.Beings.define("rat", {
	extend: "animal",
	name: "rat",
	color: [160, 160, 160],
	"char": "r"
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
});

Game.Beings.define("orc", {
	"char": "o",
	extend: "humanoid",
	color: [30, 240, 30]
});

Game.Beings.define("orc warlord", {
	extend: "orc",
	"char": "O"
});
