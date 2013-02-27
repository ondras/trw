Game.Item.Food = function(type) {
	Game.Item.call(this, type);
}
Game.Item.Food.extend(Game.Item);

Game.Item.Food.prototype.eat = function(being) {
	/* FIXME cheating, shall format properly */
	Game.status.show("You eat %the.", this);
	if (being.getHP() == being.getMaxHP()) { 
		Game.status.show("Tasty.");
	} else {
		being.adjustHP(2);
		if (being.getHP() == being.getMaxHP()) {
			Game.status.show("Tastes very good: you are fully healed.");
		} else {
			Game.status.show("Tastes good: you are partially healed.");
		}
	}
}

