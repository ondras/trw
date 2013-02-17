Game.Intro = function() {
	this._node = document.querySelector("#intro");
	
	
	this._promise = new Promise();
	
	this._node.parentNode.removeChild(this._node);
	this._promise.fulfill();
}

Game.Intro.prototype.then = function() {
	return this._promise.then.apply(this._promise, arguments);
}
