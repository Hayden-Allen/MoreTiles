function DebugInfo(){	//formats string containing debug info to be displayed under canvas
	//player coordinates
	this.x = 0;
	this.y = 0;

	this.sprites = 0;	//sprites drawn this frame
	this.minSprites = 0;	//minimum sprites drawn in any frame in current Scene
	this.maxSprites = 0;	//maximum sprites drawn in any frame in current Scene

	this.fps = 0;	//frames per second
	this.avgfps = 0;	//average frames per second
	this.totalfps = 0;	//sum of all fps values
	this.updates = 1;	//number of times update has been called

	this.pad = function(places, num){	//formats string by placing 0s in front until it reaches a given length
		var s = num + "";
		while(s.length < places) s = "0" + s;
		return s;
	}

	//specified in case totalfps overflows and calculations need to start from scratch
	var temp = new Date();
	this.avgfpsstart = this.pad(2, temp.getHours()) + ":" + this.pad(2, temp.getMinutes()) + ":" + this.pad(2, temp.getSeconds());

	this.update = function(x, y, sprites, minSprites, maxSprites, fps){
		//use given player coordinates
		this.x = x;
		this.y = y;

		//data from Renderer
		this.sprites = sprites;
		this.minSprites = minSprites;
		this.maxSprites = maxSprites;

		this.fps = Math.round(fps);	//round because it looks better
		this.totalfps += fps;	//add current frame's fps calculation to total
		this.updates++;
		//if totalfps or updates overflow, reset
		if(this.updates > Number.MAX_SAFE_INTEGER || this.totalfps > Number.MAX_SAFE_INTEGER){
			this.updates = 1;
			this.totalfps = fps;
			var temp = new Date();
			this.avgfpsstart = this.pad(2, temp.getHours()) + ":" + this.pad(2, temp.getMinutes()) + ":" + this.pad(2, temp.getSeconds());
		}
		//round because it looks better
		this.avgfps = Math.round(this.totalfps / this.updates);
	}
	this.string = function(){	//formatted string
		return `{ Player: (${this.x.toFixed(2)}, ${this.y.toFixed(2)}) | Player Tile: (${parseInt(this.x / Global.tilesize)}, ${parseInt(this.y / Global.tilesize)}) |
				Sprites: ${this.sprites} (min: ${this.minSprites}, max: ${this.maxSprites}) |
				FPS: ${this.fps} | Average FPS: ${this.avgfps} (since ${this.avgfpsstart}) }`;
	}
}
