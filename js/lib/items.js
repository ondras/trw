Game.Items = new Game.Repository(Game.Item);

Game.Items.define("gold",  {
	"char": "$",
	color: [255, 255, 30],
	name: "piece of gold"
});

Game.Items.define("torch",  {
	"char": "^",
	name: "torch",
	light: [240, 240, 30],
	color: [240, 240, 30]
});
