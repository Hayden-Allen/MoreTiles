class Tile {	//textured swuare
	constructor(src, x, y, extra, flags){
		this.img = new Image();	//texture
		this.img.src = src;	//filepath

		this.extra = extra || {};	//extra data
		this.flags = flags || new BitSet(Global.Flag.Property.grid);	//by default, clamped to Scene grid

		//coordinates
		this.x = x * (this.flags.at(Global.Flag.Index.grid) ? Global.tilesize : 1);
		this.y = y * (this.flags.at(Global.Flag.Index.grid) ? Global.tilesize : 1);
		//width and height
		this.w = (this.extra.w || 1) * Global.tilesize;
		this.h = (this.extra.h || 1) * Global.tilesize;
		this.center = {x: this.x + this.w / 2, y: this.y + this.h / 2};	//center point

		this.extra.rotation = this.extra.rotation || 0;	//angle of rotation

		this.children = [];	//Tiles that are attached to this Tile

		if(this.extra.add || this.extra.add === undefined)
			Global.currentScene.add(this);	//unless specified, add to Scene automatically
	}
	setRotation(rad){
		this.extra.rotation = rad;
	}
	addChild(obj){
		if(obj !== undefined)	//default value for Character item
			this.children.push(obj);
	}
	removeChild(obj){
		if(obj !== undefined){
			for(var i = 0; i < this.children.length; i++){
				if(this.children[i] === obj){
					this.children.splice(i, 1);
					return;
				}
			}
		}
	}
	addX(x){
		this.x += x;
		this.center.x = this.x + this.w / 2;
	}
	setX(x){
		this.x = x;
		this.center.x = this.x + this.w / 2;
	}
	addY(y){
		this.y += y;
		this.center.y = this.y + this.h / 2;
	}
	setY(y){
		this.y = y;
		this.center.y = this.y + this.h / 2;
	}
	draw(offx, offy){
		if(this.extra.rigid)
			Tools.testRigids(this, offx, offy);	//prevent collision

		Global.ctx.save();	//save canvas state

		Global.ctx.globalAlpha = this.extra.alpha;	//set opacity
		Global.ctx.translate(this.center.x + offx, this.center.y + offy);	//move canvas origin to center of Tile
		Global.ctx.rotate(this.extra.rotation);	//apply rotation
		Global.ctx.drawImage(this.img, this.x - this.center.x, this.y - this.center.y, this.w, this.h);	//draw rotated texture

		var self = this;
		this.children.forEach(function(c){	//do the same for all children (w/ same rotation)
			c.draw(-self.w / 2, -self.h / 2);
		});

		Global.ctx.restore();	//restore canvas state
	}
}
class AnimatedTile extends Tile {	//Tile with several states to display
	constructor(frames, time, src, x, y, flags, extra){
		super(src, x, y, flags, extra);
		this.time = time;	//time for one cycle of animation
		this.frames = frames;	//number of frames on texture
		this.frame = 0;	//current frame
		this.frameTime = this.time / this.frames;	//time per frame
		this.last = performance.now();	//time of last frame switch
	}
	draw(offx, offy, time){
		if(this.extra.rigid)
			Tools.testRigids(this, offx, offy);	//prevent collision
		if(time - this.last >= this.frameTime){	//if enough time passed, advance current frame
			this.last = time;
			this.frame = (this.frame + 1) % this.frames;	//automatically loops back to 0
		}

		Global.ctx.save();	//save canvas state

		Global.ctx.globalAlpha = this.extra.alpha;	//set opacity
		Global.ctx.translate(this.center.x + offx, this.center.y + offy);	//move canvas origin to center of Tile
		Global.ctx.rotate(this.extra.rotation);	//rotate about origin
		Global.ctx.drawImage(this.img, this.frame * Global.tilesize, 0, Global.tilesize, Global.tilesize,
								this.x - this.center.x, this.y - this.center.y, this.w, this.h);	//crop current frame from texture and draw

		Global.ctx.restore();	//restore canvas state
	}
}
