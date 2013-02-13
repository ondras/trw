Game.Description = function() {
	this._boringCellTypes = ["stonewall", "floor", "path"];

	this._dom = {
		local: document.querySelector("#description #local"),
		inventory: document.querySelector("#description #inventory"),
		action: document.querySelector("#description #action")
	}
}

Game.Description.prototype.inventory = function() {

}

Game.Description.prototype.action = function() {

}
