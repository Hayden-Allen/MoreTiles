class Projectile extends Tile {
	constructor(src, x, y, speed, dir, extra, flags){
		super(src, x, y, extra, flags);
		this.direction = dir;
		this.speed = speed / 1000 * Global.tilesize;
	}
	draw(offx, offy, time){
		super.draw(offx, offy, time);
		this.addX(this.direction.x * this.speed * Global.delta);
		this.addY(this.direction.y * this.speed * Global.delta);
		
		var bounds = Global.currentScene.bounds;
		if(this.x > bounds.right ||
		   this.x + this.w < bounds.left ||
		   this.y > bounds.bottom ||
		   this.y + this.h < bounds.top)
			Global.currentScene.remove(this);
	}
}