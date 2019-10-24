class Character extends Tile {	//Tile with an Inventory and movement speed
	constructor(src, x, y, speed, inventory, extra, flags){
		super(src, x, y, extra, flags);

		this.inventory = inventory || new Inventory();	//if no inventory given, create new one
		this.speed = speed / 1000 * Global.tilesize;	//in units of tiles/second; scaled by Global.delta, which is in ms
		this.equipped;	//current item

		this.equip(0);	//equip first item in list by default

		Global.currentScene.add(this);	//automatically add to Scene
	}
	equip(index){	//equip Item at given index in Inventory
		this.removeChild(this.equipped ? this.equipped.tile : undefined);

		this.equipped = this.inventory.select(index);
		this.addChild(this.equipped ? this.equipped.tile : undefined);
	}
}
