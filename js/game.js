var Game = {
	engine: new ROT.Engine(),
	player: null,
	level: null,
	
	init: function() {
		window.addEventListener("load", this);
	},

	handleEvent: function(e) {
		switch (e.type) {
			case "load":
				window.removeEventListener("load", this);
				this._load();
			break;

			case "resize":
				this._resize();
			break;
		}
	},

	switchLevel: function(newLevel, cell, direction) {
		var oldLevel = this.level;
		this.level = null;
		if (oldLevel) { this.engine.lock(); }

		var position = newLevel.getCellById(cell || "start").getPosition();
		
		/* clear the old level */
		if (oldLevel) {
			oldLevel.removeBeing(this.player);
			this.engine.clear();
		}

		this._transitionLevel(newLevel, oldLevel, direction);

		/* welcome the new level */
		newLevel.setBeing(this.player, position[0], position[1]);
		for (var p in newLevel.beings) {
			this.engine.addActor(newLevel.beings[p]);
		}

		this.level = newLevel; /* AFTER the player has been set to prevent recursive transitions */
		this._resize();


		this.engine.unlock();
	},

	_transitionLevel: function(newLevel, oldLevel, direction) {
		var oppositeMap = {
			left: "right",
			right: "left",
			top: "bottom",
			bottom: "top",
			fade: "fade"
		};

		var newNode = newLevel.getContainer();
		newNode.className = direction;
		document.querySelector("#level").appendChild(newNode);

		document.body.offsetWidth; /* FIXME hack */

		if (oldLevel) { oldLevel.getContainer().className = oppositeMap[direction]; }
		newNode.className = "";
	},

	_load: function(e) {
		this.player = Game.Beings.create("player");
/*
		var c1 = [100, 100, 150];
		var c2 = [220, 170, 30];
		var h1 = document.querySelector("h1");
		var str = h1.innerHTML;
		h1.innerHTML = "";
		for (var i=0;i<str.length;i++) {
			var ch = str.charAt(i);
			var span = document.createElement("span");
			var color = ROT.Color.interpolateHSL(c1, c2, i/(str.length-1));
			span.style.color = ROT.Color.toRGB(color);
			span.innerHTML = ch;
			h1.appendChild(span)
		}
		document.querySelector("#intro").className = "visible";

		Promise.event(document, "keydown").then(this._start.bind(this));
*/		
		this._start();
	},

	_start: function(e) {
/*		var intro = document.querySelector("#intro");
		intro.parentNode.removeChild(intro);
*/		
		window.addEventListener("resize", this);
		Game.LevelManager.get("forest").then(function(level) {
			this.switchLevel(level, null, "fade");
		}.bind(this));
	},
	
	_resize: function() {
		if (!this.level) { return; }
		var parent = document.querySelector("#level");
		this.level.resize(parent.offsetWidth, parent.offsetHeight);
	}
}

Game.init();
