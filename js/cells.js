Game.Cells = new Game.Repository(Game.Cell);

Game.Cells.define("stonewall", {
	blocksMovement: 1,
	blocksLight: 1,
	ch: "#",
	color: [80, 80, 80],
	colorVariation: 10,
	name: "stone wall"
});

Game.Cells.define("floor", {
	ch: ".",
	color: [130, 130, 130],
	colorVariation: 10,
	name: "plain floor"
});

Game.Cells.define("staircase-up", {
	ch: "<",
	name: "staircase leading up"
});

Game.Cells.define("staircase-down", {
	ch: ">",
	name: "staircase leading down"
});

Game.Cells.define("grass", {
	ch: ['"', '"', '"', "'"],
	color: [150, 220, 50],
	colorVariation: [30, 30, 10],
	name: "grassy ground"
});

Game.Cells.define("door", {
	ctor: Game.Cell.Door,
	color: [153, 102, 51]
});
