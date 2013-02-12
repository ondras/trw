Game.Player = function(type) {
	Game.Being.call(this, type);
	
	this._light = [30, 30, 30]; 

	this._actionKeys = {};
	this._actionKeys[ROT.VK_PERIOD] = 1;
	this._actionKeys[ROT.VK_CLEAR] = 1;
	this._actionKeys[ROT.VK_NUMPAD5] = 1;

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
}
Game.Player.extend(Game.Being);

Game.Player.prototype.act = function() {
/*	Game.status.describe(); */
	this._level.updateLighting(); /* FIXME urco? */
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
	if (code in this._actionKeys) {
		return this._action(this._actionKeys[code]);
	}

	if (code in this._directionKeys) {
		var dir = ROT.DIRS[8][this._directionKeys[code]];
		var x = this._position[0] + dir[0];
		var y = this._position[1] + dir[1];
		if (this._isPassable(x, y)) { /* MOVE */
			this._level.setBeing(this, x, y);
			return true;
		}

		var cell = this._level.cells[x+","+y];
		if (cell instanceof Game.Cell.Door) {
			if (cell.isLocked()) {
				Game.status.message("The door is locked.");
				return false;
			}
			cell.open();
			return true;
		}

		return false; /* wall */
	}

	return false; /* unknown key */
}

Game.Player.prototype.setPosition = function(x, y, level) {
	if (this._position) { this._level.removeLight(this._position[0], this._position[1], this._light); }

	Game.Being.prototype.setPosition.call(this, x, y, level);

	if (x !== null) { 
		this._level.addLight(x, y, this._light); 
		var visibility = this._getVisibleArea();
		this._level.setVisibility(visibility);
		Game.description.local();
	}
}

Game.Player.prototype.setLight = function(light) {
	if (!this._level) { 
		this._light = light;
		return;
	}
	
	if (this._light) { this._level.removeLight(this._position[0], this._position[1], this._light); }
	this._light = light;
	if (this._light) { this._level.addLight(this._position[0], this._position[1], this._light); }
	
	return this;
}

Game.Player.prototype._action = function() {
	/* FIXME action */
}

Game.Player.prototype._getVisibleArea = function() {
	var RANGE = 8; /* FIXME constant */
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
