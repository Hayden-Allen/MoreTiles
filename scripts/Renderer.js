class Renderer {	//takes a Scene and a Camera and draws everything
	constructor(){
		this.sprites;	//number of draw operations this frame
		this.minSprites = Number.MAX_SAFE_INTEGER;	//minimum sprites drawn in current Scene
		this.maxSprites = -Number.MAX_SAFE_INTEGER;	//maximum sprites drawn in current Scene
	}
	render(scene, camera){
		this.sprites = 0;	//reset sprite counter
		camera.update(scene);	//get offset coordinates

		var self = this;
		//draw all objects in Scene
		scene.objects.forEach(function(o){
			//if visible based on offsets, draw and increment sprite counter
			if(o.x + o.w + camera.offx >= 0 && o.x + camera.offx <= c.width && o.y + o.h + camera.offy >= 0 && o.y + camera.offy <= c.height){
				o.draw(camera.offx, camera.offy, Global.now);
				self.sprites++;
			}
		});

		//update min and max if necessary
		this.minSprites = Math.min(this.minSprites, this.sprites);
		this.maxSprites = Math.max(this.maxSprites, this.sprites);

		//draw shadows over whole Scene
		for(var i = 0; i < scene.lightMap.length; i++)
			for(var j = 0; j < scene.lightMap[i].length; j++)
				Tools.rect(scene.bounds.left + camera.offx + j * Global.tilesize, scene.bounds.top + camera.offy + i * Global.tilesize,
							Global.tilesize, Global.tilesize, "#000000", 1 - scene.lightMap[i][j] / Global.lightMax);

		//finally, draw UI elements
		scene.uis.forEach(function(o){
			o.draw(0, 0, Global.now);
		});
	}
}
