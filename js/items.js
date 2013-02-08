Game.Items = new Game.Repository(Game.Item);

Game.Items.define("gold",  {
	ch: "$",
	color: [255, 255, 30],
	name: "piece of gold"
});

Game.Items.define("torch",  {
	blocksLight: 0,
	blocksMovement: 1,
	ch: "^",
	name: "wall-mounted torchlight"
});
