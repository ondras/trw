Game.Intro = function() {
	this._node = document.querySelector("#intro");
	this._promise = new Promise();
	
	window.addEventListener("keypress", this);
}

Game.Intro.prototype.then = function() {
	return this._promise.then.apply(this._promise, arguments);
}

Game.Intro.prototype.handleEvent = function(e) {
	window.removeEventListener("keypress", this);
	this._node.parentNode.removeChild(this._node);
	this._promise.fulfill();
}
