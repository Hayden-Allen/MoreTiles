class Renderer {
	constructor(){
		this.sprites;
		this.minSprites = Number.MAX_SAFE_INTEGER;
		this.maxSprites = -Number.MAX_SAFE_INTEGER;
	}
	render(scene, camera){
		this.sprites = 0;
		camera.update(scene);
		
		var self = this;
		scene.objects.forEach(function(o){
			if(o.x + o.w + camera.offx >= 0 && o.x + camera.offx <= c.width && o.y + o.h + camera.offy >= 0 && o.y + camera.offy <= c.height){
				o.draw(camera.offx, camera.offy, Global.now);
				self.sprites++;
			}
		});
		
		this.minSprites = Math.min(this.minSprites, this.sprites);
		this.maxSprites = Math.max(this.maxSprites, this.sprites);
		
		var step = 1 / Global.lightMax;
		for(var i = 0; i < scene.lightMap.length; i++)
			for(var j = 0; j < scene.lightMap[i].length; j++)
				Tools.rect(scene.bounds.left + camera.offx + j * Global.tilesize, scene.bounds.top + camera.offy + i * Global.tilesize, 
							Global.tilesize, Global.tilesize, "#000000", 1 - scene.lightMap[i][j] * step);
							
		scene.uis.forEach(function(o){
			o.draw(0, 0, Global.now);
		});
	}
}