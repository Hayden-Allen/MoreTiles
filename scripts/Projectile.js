class Projectile extends Tile {	//Tile that travels in a direction until it hits something
	constructor(src, x, y, speed, dir, extra, flags){
		super(src, x, y, extra, flags);
		this.direction = dir;	//direction vector
		this.speed = speed / 1000 * Global.tilesize;	//speed to multiply direction components by (in tiles/sec)

		this.start = {x: x, y: y};	//start position
	}
	draw(offx, offy, time){
		super.draw(offx, offy, time);	//draw Tile
		//update position
		this.addX(this.direction.x * this.speed * Global.delta);
		this.addY(this.direction.y * this.speed * Global.delta);

		var bounds = Global.currentScene.bounds;
		//if out of bounds of Scene OR maximum distance from start reached
		if(this.x > bounds.right ||
		   this.x + this.w < bounds.left ||
		   this.y > bounds.bottom ||
		   this.y + this.h < bounds.top ||
		   Math.sqrt((this.x - this.start.x) ** 2 + (this.y - this.start.y) ** 2) >= this.direction.distance)
			Global.currentScene.remove(this);	//delete
	}
}
