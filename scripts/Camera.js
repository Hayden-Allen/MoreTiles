class Camera {	//follows a target Tile and calculates coordinate offsets around that target
	constructor(target){
		this.target = target;	//the Tile to follow
		//offsets
		this.offx;
		this.offy;
	}
	update(scene){
		if(this.target.extra.rigid)	//before calculating offsets, make sure the target is in a valid position
			Tools.testRigids(this.target, Global.c.width / 2 - this.target.center.x, Global.c.height / 2 - this.target.center.y);

		//coordinate of center of target
		var cx = this.target.center.x, cy = this.target.center.y;
		//target.x + offx = Global.c.width / 2 - target.w / 2
		//offx = Global.c.width / 2 - target.w / 2 - target.x = Global.c.width / 2 - cx
		this.offx = Global.c.width / 2 - cx;
		this.offy = Global.c.height / 2 - cy;

		//bound offsets to Scene; if the Scene is big enough, prevent areas outside of it from being displayed
		if(scene.bounds.right - scene.bounds.left > c.width){
			if(cx - c.width / 2 < scene.bounds.left)
				this.offx = -scene.bounds.left;
			if(cx + c.width / 2 > scene.bounds.right)
				this.offx = c.width - scene.bounds.right;
		}
		if(scene.bounds.bottom - scene.bounds.top > c.height){
			if(cy - c.height / 2 < scene.bounds.top)
				this.offy = -scene.bounds.top;
			if(cy + c.height / 2 > scene.bounds.bottom)
				this.offx = c.height - scene.bounds.bottom;
		}

		//round to avoid weird lighting effects
		this.offx = Math.round(this.offx);
		this.offy = Math.round(this.offy);
	}
}
