class Character extends Tile {
	constructor(src, x, y, speed, inventory, extra, flags){
		super(src, x, y, extra, flags);
		
		this.inventory = inventory || new Inventory();
		this.speed = speed / 1000 * Global.tilesize;
		this.equipped;
		
		this.equip(0);
		
		Global.currentScene.add(this);
	}
	equip(index){
		this.removeChild(this.equipped ? this.equipped.tile : undefined);
		
		this.equipped = this.inventory.select(index);
		this.addChild(this.equipped ? this.equipped.tile : undefined);
	}
}