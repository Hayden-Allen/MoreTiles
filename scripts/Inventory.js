class Inventory {	//stores and operates on a list of Items
	constructor(items, size){
		this.size = size || 5;	//default max size is 5
		this.items = items || [];	//if no array given, create empty one
		this.selected = 0;	//current Item

		if(this.items.length)	//if item list given, call first Item's selection method
			this.items[this.selected].onSelect();

		//formatting for UI
		this.padding = Global.tilesize / 8;
		this.start = Math.round(c.width / 2 - (9 * (Global.tilesize + (26 / 9) * this.padding)) / 2);	//assumes 9 Items
		this.step = (Global.tilesize + this.padding * 3);	//difference in x coordinate for successive UI elements
		var tsize = 1 + (this.padding * 2) / Global.tilesize;	//size of UI background panels
		var y = c.height - (Global.tilesize + this.padding * 3);	//displayed near bottom of screen

		this.tiles = [];	//list of elements
		for(var i = 0; i < 9; i++)
			this.tiles.push(new Tile(
								"assets/ui/inventory_panel.png",
								this.start + this.step * i,	//increment x position by step each time
								y,	//same y value
								{
									w: tsize,	//special size (slightly bigger than tilesize so that Item textures fit inside)
									h: tsize,
									alpha: .5	//half transparent so it's not to annoying
								},
								new BitSet(Global.Flag.Property.ui)	//is a UI element
							));

		//add Item textures on top of background panels
		for(var i = 0; i < Math.min(this.items.length, 9); i++){
			var item = this.items[i].tile;
			var w = item.w / Global.tilesize, h = item.h / Global.tilesize;
			this.tiles.push(new Tile(
								item.img.src,	//use same texture
								//center in each panel
								((this.start + this.padding) + this.step * i) + (1 - w) * Global.tilesize / 2,
								(y + this.padding) + (1 - h) * Global.tilesize / 2,
								{
									w: w,
									h: h
								},
								new BitSet(Global.Flag.Property.ui)	//is UI element
							));
		}

		this.cursor = new Tile(	//black cursor that hovers over seleted Item
							"assets/ui/cursor_fixed.png",
							this.start + this.selected * this.step,
							y,
							{
								//same dimensions as UI panels
								w: tsize,
								h: tsize
							},
							new BitSet(Global.Flag.Property.ui)	//is UI element
						);
	}
	select(index){
		if(index !== this.selected){
			if(this.items[this.selected])	//if equipped Item exists, call cleanup function
				this.items[this.selected].onDeselect();

			this.selected = index;	//switch selected Item
			this.cursor.setX(this.start + this.selected * this.step);	//move cursor to new position

			if(this.items[this.selected])	//call new Item's setup function
				this.items[this.selected].onSelect();
		}
		return this.items[this.selected];
	}
}
