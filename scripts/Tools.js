Tools = {
	rect: function(x, y, w, h, color, alpha){
		Global.ctx.globalAlpha = alpha;
		Global.ctx.fillStyle = color;
		Global.ctx.fillRect(x, y, w, h);
	},
	clearScreen: function(){
		requestAnimationFrame(update);
		Global.ctx.clearRect(0, 0, c.width, c.height);
		Tools.rect(0, 0, c.width, c.height, "#000000", 1);
		
		Tools.updateDelta();
	},
	angle: function(x1, y1, x2, y2){
		var dx = x1 - x2, dy = y1 - y2;
		var theta = Math.atan(dy / dx);
			
		if(dx >= 0)
			theta = Math.PI * 2 - theta;
		else {
			if(dy <= 0)
				theta = Math.PI - theta;
			else
				theta = Math.PI * 3 - theta;
		}
		
		if(theta > Math.PI * 2)
			theta -= Math.PI * 2;
		if(theta < 0)
			theta += Math.PI * 2;
		
		return {dx: dx, dy: dy, theta: theta, deg: theta * (180 / Math.PI), sin: Math.sin(theta), cos: Math.cos(theta)};
	},
	updateDelta: function(){
		Global.now = performance.now();
		Global.delta = Global.now - Global.last;
		Global.last = Global.now;
	},
	tileStretch: function(src, x, y, w, h, flags, extra){
		for(var i = 0; i < h; i++)
			for(var j = 0; j < w; j++)
				new Tile(src, x + j, y + i, flags, extra);
	},
	debug: function(target, msg){
		document.getElementById(target).innerHTML = msg;
	},
	clamp: function(val, min, max){
		return Math.max(min, Math.min(val, max));
	},
	testRigids: function(tile, offx, offy){
		var collision = undefined;
		
		for(var i = 0; !collision && i < Global.currentScene.rigids.length; i++){
			var r = Global.currentScene.rigids[i];
			if(tile !== r){
				var angle = Tools.angle(tile.center.x, tile.center.y, r.center.x, r.center.y).deg;
			
				if(angle >= 45 && angle < 135 && (tile.x + tile.w > r.x && tile.x < r.x + r.w && tile.y + tile.h > r.y)){
					if(tile.flags.at(Global.Flag.Index.movable))
						tile.setY(r.y - tile.h);
					collision = r;
				}
				if(angle >= 135 && angle < 225 && (tile.y + tile.h > r.y && tile.y < r.y + r.h && tile.x + tile.w > r.x)){
					if(tile.flags.at(Global.Flag.Index.movable))
						tile.setX(r.x - tile.w);
					collision = r;
				}
				if(angle >= 225 && angle < 315 && (tile.x + tile.w > r.x && tile.x < r.x + r.w && tile.y < r.y + r.h)){
					if(tile.flags.at(Global.Flag.Index.movable))
						tile.setY(r.y + r.h);
					collision = r;
				}
				if((angle >= 315 || angle < 45) && (tile.y + tile.h > r.y && tile.y < r.y + r.h && tile.x < r.x + r.w)){
					if(tile.flags.at(Global.Flag.Index.movable))
						tile.setX(r.x + r.w);
					collision = r;
				}
			}
		}		
		if(collision){
			if(tile.flags.at(Global.Flag.Index.destructible) && collision.flags.at(Global.Flag.Index.destructive))
				Global.currentScene.remove(tile);
			if(tile.flags.at(Global.Flag.Index.destructive) && collision.flags.at(Global.Flag.Index.destructible))
				Global.currentScene.remove(collision);
		}
		
		return collision;
	},
	sleep: function(ms){
		return new Promise(resolve => setTimeout(resolve, ms));
	},
	toCartesianAngle: function(angle){
		return ((5 - (angle / (Math.PI / 2))) % 4) * (Math.PI / 2);
	},
	toTileCoord(x){
		return parseInt(x / Global.tilesize) * Global.tilesize;
	}
}