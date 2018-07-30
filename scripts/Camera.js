class Camera {
	constructor(target){
		this.target = target;
		this.offx;
		this.offy;
	}
	update(scene){
		if(this.target.extra.rigid)
			Tools.testRigids(this.target, Global.c.width / 2 - this.target.center.x, Global.c.height / 2 - this.target.center.y);
		
		var cx = this.target.center.x, cy = this.target.center.y;
		this.offx = Global.c.width / 2 - cx;
		this.offy = Global.c.height / 2 - cy;
		
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
		
		this.offx = Math.round(this.offx);
		this.offy = Math.round(this.offy);
	}
}