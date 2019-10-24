class Scene {	//stores Tile and light data
	constructor(lightMin){
		this.objects = [];	//list of Tiles
		this.rigids = [];	//list of rigid Tiles (for processing speed)
		this.uis = [];	//list of UI elements

		this.bounds = {};	//coordinate boundaries

		this.lightMin = lightMin;	//minumum light value for any Tile
		this.lightMap = [];	//grid of light values for each Tile
		this.lights = [];	//list of lights used to calculate lightMap

		Global.currentScene = this;	//automatically switch current Scene
	}
	add(obj){
		if(obj.flags.at(Global.Flag.Index.ui)){
			this.uis.push(obj);
			return;	//don't add UI elements to regular lists
		}

		this.objects.push(obj);	//push to default array
		if(obj.extra.light)	//if it emits light, put a light object in lights array
			this.lights.push({x: obj.x / Global.tilesize, y: obj.y / Global.tilesize, i: Math.min(obj.extra.light, Global.lightMax - this.lightMin)});
		if(obj.extra.rigid)	//if it's rigid, also put it in rigids array
			this.rigids.push(obj);

		if(!obj.flags.at(Global.Flag.Index.fromPlayer)){	//if not a temporary Tile, update boundary coordinates
			if(this.bounds.top === undefined || obj.y < this.bounds.top)
				this.bounds.top = obj.y;
			if(this.bounds.left === undefined || obj.x < this.bounds.left)
				this.bounds.left = obj.x;
			if(this.bounds.bottom === undefined || obj.y + obj.h > this.bounds.bottom)
				this.bounds.bottom = obj.y + obj.h;
			if(this.bounds.right === undefined || obj.x + obj.w > this.bounds.right)
				this.bounds.right = obj.x + obj.w;
		}
	}
	remove(obj){	//remove object from all lists that may contain it
		for(var i = 0; i < this.objects.length; i++){
			if(this.objects[i] === obj){
				if(this.objects[i].onDestroy)
					this.objects[i].onDestroy();	//call cleanup function
				this.objects.splice(i, 1);
				break;
			}
		}
		if(obj.extra.rigid){
			for(var i = 0; i < this.rigids.length; i++){
				if(this.rigids[i] === obj){
					this.rigids.splice(i, 1);
					break;
				}
			}
		}
		if(obj.flags.at(Global.Flag.Index.ui)){
			for(var i = 0; i < this.uis.length; i++){
				if(this.uis[i] === obj){
					this.uis.splice(i, 1);
					break;
				}
			}
		}
	}
	propagate(x, y, i){	//propagate a lights effects throughout lightMap
		var value = Math.min(Global.lightMax, this.lightMin + i);	//new light value
		//if out of bounds, 0 light, or current value is >= new value, return
		if(i <= 0 || y < 0 || y >= this.lightMap.length || x < 0 ||
				x >= this.lightMap[y].length ||
				this.lightMap[y][x] >= value)
			return;

		this.lightMap[y][x] = value;	//set to new value

		//propagate in cardinal directions with 1 less intensity
		this.propagate(x, y - 1, i - 1);
		this.propagate(x, y + 1, i - 1);
		this.propagate(x - 1, y, i - 1);
		this.propagate(x + 1, y, i - 1);
	}
	finalize(){	//create and fill lightMap
		for(var i = 0; i < (this.bounds.bottom - this.bounds.top) / Global.tilesize; i++)
			this.lightMap.push(new Array((this.bounds.right - this.bounds.left) / Global.tilesize).fill(this.lightMin));

		var self = this;
		this.lights.forEach(function(l){
			self.propagate(l.x, l.y, l.i);
		});
	}
}
