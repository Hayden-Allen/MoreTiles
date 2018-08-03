class Controls {
	constructor(target, extra, on){
		this.target = target;
		this.extra = extra;
		this.on = on;
		this.locked = false;
		Global.controls.push(this);
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
	unbind(){
		for(var i = 0; i < Global.controls.length; i++)
			if(Global.controls[i] === this){
				Global.controls.splice(i, 1);
				return;
			}
	}
}