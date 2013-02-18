Game.Cells = new Game.Repository(Game.Cell);

/* wall blocks */

Game.Cells.define("stonewall", {
	blocksMovement: 1,
	blocksLight: 1,
	"char": "#",
	color: [80, 80, 80],
	colorVariation: 10,
	name: "stone wall"
});

/* floor blocks */

Game.Cells.define("floor", {
	"char": ".",
	color: [130, 130, 130],
	name: "plain floor"
});

Game.Cells.define("ground", {
	"char": ".",
	color: [150, 100, 50],
	name: "plain ground"
});

Game.Cells.define("path", {
	extend: "ground",
	name: "path"
});

Game.Cells.define("pier", {
	"char": "#",
	color: [130, 90, 30],
	name: "wooden pier"
});

/* nature blocks */

Game.Cells.define("water", {
	"char": "≈",
	name: "water",
	countable: 0,
	blocksMovement: 1,
	color: [50, 50, 240],
	colorVariation: 20
});

Game.Cells.define("grass", {
	"char": ".",
	color: [100, 150, 50],
	name: "grassy ground"
});

Game.Cells.define("highgrass", {
	"char": ['"', '"', '"', "'"],
	color: [150, 220, 50],
	colorVariation: [30, 30, 10],
	name: "high grass"
});

Game.Cells.define("tree", {
	"char": ["♠", "♣"],
	color: [50, 220, 20],
	colorVariation: 20,
	blocksMovement: 1,
	blocksLight: 1,
	name: "tree"
});

Game.Cells.define("flower", {
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
});

/* features */

Game.Cells.define("staircase-up", {
	"char": "<",
	name: "staircase leading up"
});

Game.Cells.define("staircase-down", {
	"char": ">",
	name: "staircase leading down"
});

Game.Cells.define("well", {
	"char": "O",
	name: "well",
	blocksMovement: 1,
	color: [120, 120, 120]
});

Game.Cells.define("door", {
	ctor: Game.Cell.Door,
	color: [153, 102, 51]
});
