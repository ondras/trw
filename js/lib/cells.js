Game.Cells.define("gate", {
	extend: "door",
	ctor: Game.Cell.Gate
});

Game.Cells.define("blood", {
	extend: "floor",
	name: "blood",
	color: [200, 30, 30]
});
