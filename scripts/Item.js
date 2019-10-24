class Item {	//carried by Characters in Inventory
	constructor(src, x, y, cooldown, attack, extra, flags){
		extra = extra || {};	//optional parameters object
		extra.add = false;	//don't add to Scene by default

		this.tile = new Tile(src, x, y, extra, flags || new BitSet(0));	//create visual representation

		this.extra = extra;
		this.cooldown = cooldown;	//time (in ms) between uses
		this.attack = attack;	//function to call on use
		this.postCooldown = extra && extra.postCooldown ? extra.postCooldown : function(){};	//function to call after cooldown is over
		this.onSelect = extra && extra.onSelect ? extra.onSelect : function(){};	//function to call when this Item is switched to in Inventory
		this.onDeselect = extra && extra.onDeselect ? extra.onDeselect : function(){};//function to call when this Item is switched off of in Inventory
		this.canAttack = true;	//whether or not cooldown is active
	}
	async use(args){
		if(this.canAttack){	//if cooldown isn't active
			this.canAttack = false;	//disable use

			await this.attack(args);	//wait for use function
			await Tools.sleep(this.cooldown);	//force cooldown
			await this.postCooldown();

			this.canAttack = true;	//enable use again
		}
	}
}
