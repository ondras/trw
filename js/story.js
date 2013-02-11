Game.Story = function() {
	this._chapters = [];
	this._tasks = [];
	this._index = -1;
	this._dom = {
		current: document.querySelector("#story #current"),
		task: document.querySelector("#story #task"),
		prev: document.querySelector("#story #prev"),
		next: document.querySelector("#story #next")
	}
	this._dom.prev.addEventListener("click", this);
	this._dom.next.addEventListener("click", this);
}

Game.Story.prototype.handleEvent = function(e) {
	e.preventDefault();
	var diff = (e.target == this._dom.next ? 1 : -1);
	var index = this._index + diff;
	if (index < 0 || index >= this._chapters.length) { return; }
	this._show(index);
}

Game.Story.prototype.addChapter = function(text) {
	this._chapters.push(text);
	this._tasks.push("");

	this._show(this._chapters.length-1);

	this._dom.current.className = "fade";
	this._dom.current.offsetWidth;
	this._dom.current.className = "";
}

Game.Story.prototype.setTask = function(task) {
	this._tasks[this._tasks.length-1] = task;

	this._show(this._index);

	this._dom.task.className = "fade";
	this._dom.task.offsetWidth;
	this._dom.task.className = "";
}

Game.Story.prototype._show = function(index) {
	this._index = index;
	this._dom.prev.style.opacity = (index > 0 ? "" : 0);
	this._dom.next.style.opacity = (index+1 < this._chapters.length ? "" : 0);

	this._dom.current.innerHTML = this._chapters[index];

	var task = this._tasks[index];
	this._dom.task.innerHTML = (task ? "Task: " + task : "") ;
}
