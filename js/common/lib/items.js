Game.Items = new Game.Repository(Game.Item);

Game.Items.define("gold", {
	"char": "$",
	color: [255, 255, 30],
	name: "piece of gold"
});

Game.Items.define("corpse", {
	"char": "%"
}, {
	weight: 0
});

Game.Items.define("weapon", {
	"char": "(",
	ctor: Game.Item.Weapon,
	color: [100, 100, 100],
	name: "weapon"
}, {
	weight: 0
});

Game.Items.define("dagger", {
	extend: "weapon",
	name: "dagger",
	color: [150, 80, 80],
	speed: 120,
	damage: 3
});

Game.Items.define("sword", {
	extend: "weapon",
	name: "sword",
	color: [150, 150, 150],
	speed: 100,
	damage: 4
});

Game.Items.define("axe", {
	extend: "weapon",
	name: "axe",
	color: [150, 150, 100],
	speed: 80,
	damage: 5
});
