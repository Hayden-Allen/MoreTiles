class Scene {
	constructor(lightMin){
		this.objects = [];
		this.rigids = [];
		this.bounds = {};
		
		this.lightMin = lightMin;
		this.lightMap = [];
		this.lights = [];
		
		Global.currentScene = this;
	}
	add(obj){
		this.objects.push(obj);
		if(obj.extra.light)
			this.lights.push({x: obj.x / Global.tilesize, y: obj.y / Global.tilesize, i: Math.min(obj.extra.light, Global.lightMax - this.lightMin)});
		if(obj.extra.rigid)
			this.rigids.push(obj);
		
		if(this.bounds.top === undefined || obj.y < this.bounds.top)
			this.bounds.top = obj.y;
		if(this.bounds.left === undefined || obj.x < this.bounds.left)
			this.bounds.left = obj.x;
		if(this.bounds.bottom === undefined || obj.y + obj.h > this.bounds.bottom)
			this.bounds.bottom = obj.y + obj.h;
		if(this.bounds.right === undefined || obj.x + obj.w > this.bounds.right)
			this.bounds.right = obj.x + obj.w;
	}
	propagate(x, y, i){
		var value = Math.min(Global.lightMax, this.lightMin + i);
		if(i <= 0 || y < 0 || y >= this.lightMap.length || x < 0 || 
		x >= this.lightMap[y].length || 
		this.lightMap[y][x] >= value)
			return;
		
		this.lightMap[y][x] = value;
		
		this.propagate(x, y - 1, i - 1);
		this.propagate(x, y + 1, i - 1);
		this.propagate(x - 1, y, i - 1);
		this.propagate(x + 1, y, i - 1);
	}
	finalize(){
		for(var i = 0; i < (this.bounds.bottom - this.bounds.top) / Global.tilesize; i++)
			this.lightMap.push(new Array((this.bounds.right - this.bounds.left) / Global.tilesize).fill(this.lightMin));
		
		console.log(this.lightMap);
		
		var self = this;
		this.lights.forEach(function(l){
			self.propagate(l.x, l.y, l.i);
		});
	}
}