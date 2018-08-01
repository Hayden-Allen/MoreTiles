class Tile {
	constructor(src, x, y, extra, flags){
		this.img = new Image();
		this.img.src = src;
				
		this.extra = extra || {};
		this.flags = flags || new BitSet(Global.Flag.Property.grid);
		
		this.x = x * (this.flags.at(Global.Flag.Index.grid) ? Global.tilesize : 1);
		this.y = y * (this.flags.at(Global.Flag.Index.grid) ? Global.tilesize : 1);
		this.w = (this.extra.w || 1) * Global.tilesize;
		this.h = (this.extra.h || 1) * Global.tilesize;
		this.center = {x: this.x + this.w / 2, y: this.y + this.h / 2};
		
		this.extra.rotation = this.extra.rotation || 0;
		
		this.children = [];
		
		if(this.extra.add || this.extra.add === undefined)
			Global.currentScene.add(this);
	}
	setRotation(rad){
		this.extra.rotation = rad;
		
		//this.children.forEach(function(c){ c.setRotation(rad); });
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
			Tools.testRigids(this, offx, offy);
		
		Global.ctx.save();
		
		Global.ctx.globalAlpha = this.extra.alpha;
		Global.ctx.translate(this.center.x + offx, this.center.y + offy);
		Global.ctx.rotate(this.extra.rotation);
		Global.ctx.drawImage(this.img, this.x - this.center.x, this.y - this.center.y, this.w, this.h);
		
		var self = this;
		this.children.forEach(function(c){
			c.draw(-self.w / 2, -self.h / 2);
		});
		
		Global.ctx.restore();
	}
}
class AnimatedTile extends Tile {
	constructor(frames, time, src, x, y, flags, extra){
		super(src, x, y, flags, extra);
		this.time = time;
		this.frames = frames;
		this.frame = 0;
		this.frameTime = this.time / this.frames;
		this.last = performance.now();
	}
	draw(offx, offy, time){
		if(this.extra.rigid)
			Tools.testRigids(this, offx, offy);
		if(time - this.last >= this.frameTime){
			this.last = time;
			this.frame = (this.frame + 1) % this.frames;
		}
		
		Global.ctx.save();
		
		Global.ctx.globalAlpha = this.extra.alpha;
		Global.ctx.translate(this.center.x + offx, this.center.y + offy);
		Global.ctx.rotate(this.extra.rotation);
		Global.ctx.drawImage(this.img, this.frame * Global.tilesize, 0, Global.tilesize, Global.tilesize, 
								this.x - this.center.x, this.y - this.center.y, this.w, this.h);
								
		Global.ctx.restore();
	}
}