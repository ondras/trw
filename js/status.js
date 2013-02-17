Game.Status = function(node) {
	this._node = node;
}

Game.Status.prototype.clear = function() {
	this._node.innerHTML = "";
	return this;
}

Game.Status.prototype.show = function(text) {
	this._node.innerHTML += text + " ";
}
