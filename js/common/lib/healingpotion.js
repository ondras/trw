Game.Item.HealingPotion = function(type) {
	Game.Item.call(this, type);
}
Game.Item.HealingPotion.extend(Game.Item);

Game.Item.HealingPotion.prototype.drink = function(being) {
	/* FIXME cheating, shall format properly */
	Game.status.show("You drink %the.", this);
	if (being.getHP() == being.getMaxHP()) { 
		Game.status.show("Nothing happens (you are already fully healed).");
	} else {
		being.adjustHP(4);
		if (being.getHP() == being.getMaxHP()) {
			Game.status.show("You are fully healed.");
		} else {
			Game.status.show("You are partially healed.");
		}
	}
}
