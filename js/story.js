Game.Story = function(node) {
	this._chapters = [];
	this._tasks = [];
	this._index = -1;
	this._dom = {
		current: node.querySelector("#current"),
		task: node.querySelector("#task"),
		prev: node.querySelector("#story #prev"),
		next: node.querySelector("#next")
	}
	this._dom.prev.addEventListener("click", this);
	this._dom.next.addEventListener("click", this);
}

Game.Story.prototype.handleEvent = function(e) {
	e.preventDefault();
	var diff = (e.target == this._dom.next ? 1 : -1);
	var index = this._index + diff;
	if (index < 0 || index >= this._chapters.length) { return; }
	this._showChapter(index);
	this._showTask();
}

Game.Story.prototype.newChapter = function(text) {
	this._chapters.push([]);
	this._tasks.push(null);
	this.addChapter(text);
	this._showTask();
}

Game.Story.prototype.addChapter = function(text) {
	var node = this._buildNode(text);
	this._chapters[this._chapters.length-1].push(node);
	
	this._showChapter(this._chapters.length-1);

	node.offsetWidth;
	node.className = "";
}

Game.Story.prototype.setTask = function(task) {
	var node = this._buildNode("Task: " + task);
	this._tasks[this._tasks.length-1] = node;

	if (this._index+1 != this._chapters.length) { this._showChapter(this._chapters.length-1); }
	this._showTask();

	node.offsetWidth;
	node.className = "";
}

Game.Story.prototype._buildNode = function(text) {
	var node = document.createElement("p");
	node.innerHTML = text;
	node.className = "fade";
	return node;
}

Game.Story.prototype._showChapter = function(index) {
	this._index = index;
	this._dom.prev.style.opacity = (index > 0 ? "" : 0);
	this._dom.next.style.opacity = (index+1 < this._chapters.length ? "" : 0);

	this._dom.current.innerHTML = "";
	var nodes = this._chapters[this._index];
	for (var i=0;i<nodes.length;i++) { this._dom.current.appendChild(nodes[i]); }
}

Game.Story.prototype._showTask = function() {
	this._dom.task.innerHTML = "";
	var task = this._tasks[this._index];
	if (task) { this._dom.task.appendChild(task); }
}
