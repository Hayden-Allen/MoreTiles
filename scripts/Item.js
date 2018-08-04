class Item {
	constructor(src, x, y, cooldown, attack, extra, flags){
		extra = extra || {};
		extra.add = false;
		
		this.tile = new Tile(src, x, y, extra, flags || new BitSet(0));
		
		this.extra = extra;
		this.cooldown = cooldown;
		this.attack = attack;
		this.postCooldown = extra && extra.postCooldown ? extra.postCooldown : function(){};
		this.onSelect = extra && extra.onSelect ? extra.onSelect : function(){};
		this.onDeselect = extra && extra.onDeselect ? extra.onDeselect : function(){};
		this.canAttack = true;
	}
	async use(args){
		if(this.canAttack){
			this.canAttack = false;
			
			await this.attack(args);
			await Tools.sleep(this.cooldown);
			await this.postCooldown();
			
			this.canAttack = true;
		}
	}
}