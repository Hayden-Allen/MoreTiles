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
}