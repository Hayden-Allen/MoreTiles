class Character extends Tile {
	constructor(src, x, y, speed, extra, flags){
		super(src, x, y, extra, flags);
		
		this.speed = speed / 1000 * Global.tilesize;
		Global.currentScene.add(this);
	}
}