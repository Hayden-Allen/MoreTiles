class Controls {	//adds custom functionality to Tiles; mainly used for movement
	constructor(target, extra, on){
		this.target = target;	//Tile to act on
		this.extra = extra;	//extra data
		this.on = on;	//function to be executed on update
		this.locked = false;	//whether or not these Controls are active
		Global.controls.push(this);	//add to Global array for automatic update each frame
	}
	lock(){
		this.locked = true;
	}
	unlock(){
		this.locked = false;
	}
	update(keys){
		if(!this.locked)
			this.on(keys);
	}
	unbind(){	//delete
		for(var i = 0; i < Global.controls.length; i++)
			if(Global.controls[i] === this){
				Global.controls.splice(i, 1);
				return;
			}
	}
}
