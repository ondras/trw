Game.Status = function(node) {
	this._node = node;
}

Game.Status.prototype.clear = function() {
	this._node.innerHTML = "";
	return this;
}

Game.Status.prototype.show = function(text) {
	var args = [];
	for (var i=1;i<arguments.length;i++) { args.push(arguments[i]); }
	this._node.innerHTML += text.format.apply(text, args) + " ";
}
