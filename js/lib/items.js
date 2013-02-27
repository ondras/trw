Game.Items.define("flower", {
	extend: "weapon",
	damage: 0,
	"char": "*",
	colors: [
		[240, 60, 60],
		[60, 60, 240],
		[240, 120, 30],
		[240, 120, 120],
		[240, 240, 30],
		[240, 30, 240],
		[240, 240, 240],
	],
	name: "flower"
}, {
	weight: 0
});

Game.Items.define("secret-gold", {
	extend: "gold"
}, {
	weight: 0
})