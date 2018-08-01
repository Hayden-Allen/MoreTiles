class Item {
	constructor(src, x, y, cooldown, attack, extra, flags, postCooldown){
		extra = extra || {};
		extra.add = false;
		
		this.tile = new Tile(src, x, y, extra, flags || new BitSet(0));
		
		this.cooldown = cooldown;
		this.attack = attack;
		this.postCooldown = postCooldown || function(){};
		this.canAttack = true;
	}
	async use(){
		if(this.canAttack){
			this.canAttack = false;
			
			await this.attack();
			await Tools.sleep(this.cooldown);
			await this.postCooldown();
			
			this.canAttack = true;
		}
	}
}