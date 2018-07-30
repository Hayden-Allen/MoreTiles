class Renderer {
	render(scene, camera){
		camera.update(scene);
		
		scene.objects.forEach(function(o){
			o.draw(camera.offx, camera.offy, Global.now);
		});
		
		var step = 1 / Global.lightMax;
		for(var i = 0; i < scene.lightMap.length; i++)
			for(var j = 0; j < scene.lightMap[i].length; j++)
				Tools.rect(scene.bounds.left + camera.offx + j * Global.tilesize, scene.bounds.top + camera.offy + i * Global.tilesize, 
							Global.tilesize, Global.tilesize, "#000000", 1 - scene.lightMap[i][j] * step);
	}
}