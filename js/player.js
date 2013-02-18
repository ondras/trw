Game.Player = function(type) {
	Game.Being.call(this, type);
	
	this._light = [30, 30, 30]; 
	this._name = "you";


	this._directionKeys = {};
	this._directionKeys[ROT.VK_K] = 0;
	this._directionKeys[ROT.VK_UP] = 0;
	this._directionKeys[ROT.VK_NUMPAD8] = 0;
	this._directionKeys[ROT.VK_U] = 1;
	this._directionKeys[ROT.VK_NUMPAD9] = 1;
	this._directionKeys[ROT.VK_L] = 2;
	this._directionKeys[ROT.VK_RIGHT] = 2;
	this._directionKeys[ROT.VK_NUMPAD6] = 2;
	this._directionKeys[ROT.VK_N] = 3;
	this._directionKeys[ROT.VK_NUMPAD3] = 3;
	this._directionKeys[ROT.VK_J] = 4;
	this._directionKeys[ROT.VK_DOWN] = 4;
	this._directionKeys[ROT.VK_NUMPAD2] = 4;
	this._directionKeys[ROT.VK_B] = 5;
	this._directionKeys[ROT.VK_NUMPAD1] = 5;
	this._directionKeys[ROT.VK_H] = 6;
	this._directionKeys[ROT.VK_LEFT] = 6;
	this._directionKeys[ROT.VK_NUMPAD4] = 6;
	this._directionKeys[ROT.VK_Y] = 7;
	this._directionKeys[ROT.VK_NUMPAD7] = 7;

	this._directionKeys[ROT.VK_PERIOD] = -1;
	this._directionKeys[ROT.VK_CLEAR] = -1;
	this._directionKeys[ROT.VK_NUMPAD5] = -1;
}
Game.Player.extend(Game.Being);

Game.Player.prototype.act = function() {
	this._level.checkRules(); /* FIXME tady? */	
	this._level.updateLighting(); /* FIXME urco? */
	Game.legend.update(this._position[0], this._position[1]);
	Game.engine.lock();
	window.addEventListener("keydown", this);
}

Game.Player.prototype.handleEvent = function(e) {
	var code = e.keyCode;

	var keyHandled = this._handleKey(e.keyCode);

	if (keyHandled) {
		window.removeEventListener("keydown", this);
		Game.engine.unlock();
	}
}

Game.Player.prototype._handleKey = function(code) {
	Game.status.clear();

	if (code in this._directionKeys) {
		var direction = this._directionKeys[code];
		if (direction == -1) { return true; } /* noop */

		var dir = ROT.DIRS[8][direction];
		var x = this._position[0] + dir[0];
		var y = this._position[1] + dir[1];		
		return this._tryMovingTo(x, y);
	}

	return false; /* unknown key */
}

Game.Player.prototype.setPosition = function(x, y, level) {
	Game.Being.prototype.setPosition.call(this, x, y, level);
	
	this.updateVisibility();
	
	return this;
}

Game.Player.prototype.updateVisibility = function() {
	var visibility = this._getVisibleArea();
	this._level.setVisibility(visibility);
}

Game.Player.prototype._getVisibleArea = function() {
	var RANGE = this._sightRange;
	var result = {};
	var level = this._level;
	var pos = this._position;

	var lightPasses = function(x, y) {
		var cell = level.cells[x+","+y];
		return (cell && !cell.blocksLight());
	}

	var callback = function(x, y, R, amount) {
		var dx = x-pos[0]; 
		var dy = y-pos[1]; 
		if (dx*dx+dy*dy*Math.sqrt(3) > RANGE*RANGE) { return; }
		result[x+","+y] = amount;
	}

	var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
	fov.compute(pos[0], pos[1], RANGE, callback);
	return result;
}

Game.Player.prototype._tryMovingTo = function(x, y) {
	var key = x+","+y;
	var being = this._level.beings[key];
	
	if (being) { /* being - chat or fight */
		if (being.isHostile()) {
			this._attack(being);
		} else {
			this._chat(being);
		}
		return true;
	}
	
	var cell = this._level.cells[key];
	if (cell) {
		if (cell.blocksMovement()) {
			cell.bumpInto(this);
		} else {
			this._level.setBeing(this, x, y);
		}
		return true;
	}
	
	return false; /* non-existant cell */
}

Game.Player.prototype._attack = function(being) {
}

Game.Player.prototype._chat = function(being) {
	Game.status.show("You talk to " + being.describeA()+".");
	var response = being.chat(this);
	if (response) {
		response = being.describeThe().capitalize() + " responds: \"" + response + "\"";
	} else {
		response = "No response."
	}
	Game.status.show(response);
}
