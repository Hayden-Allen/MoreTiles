class Inventory {
	constructor(items, size){
		this.size = size || 5;
		this.items = items || [];
		this.selected = 0;
		
		if(this.items.length)
			this.items[this.selected].onSelect();
		
		this.padding = Global.tilesize / 8;
		this.start = Math.round(c.width / 2 - (9 * (Global.tilesize + (26 / 9) * this.padding)) / 2);
		this.step = (Global.tilesize + this.padding * 3);
		var tsize = 1 + (this.padding * 2) / Global.tilesize, y = c.height - (Global.tilesize + this.padding * 3);
		
		this.tiles = [];
		for(var i = 0; i < 9; i++)
			this.tiles.push(new Tile(
								"assets/ui/inventory_panel.png",
								this.start + this.step * i,
								y,
								{
									w: tsize,
									h: tsize,
									alpha: .5
								},
								new BitSet(Global.Flag.Property.ui)
							));
		
		for(var i = 0; i < Math.min(this.items.length, 9); i++){
			var item = this.items[i].tile;
			var w = item.w / Global.tilesize, h = item.h / Global.tilesize;
			this.tiles.push(new Tile(
								item.img.src,
								((this.start + this.padding) + this.step * i) + (1 - w) * Global.tilesize / 2,
								(y + this.padding) + (1 - h) * Global.tilesize / 2,
								{
									w: w,
									h: h
								},
								new BitSet(Global.Flag.Property.ui)
							));
		}
		
		this.cursor = new Tile(
							"assets/ui/cursor_fixed.png",
							this.start + this.selected * this.step, 
							y, 
							{
								w: tsize,
								h: tsize
							}, 
							new BitSet(Global.Flag.Property.ui)
						);
	}
	select(index){
		if(index !== this.selected){
			if(this.items[this.selected])
				this.items[this.selected].onDeselect();
			
			this.selected = index;
			this.cursor.setX(this.start + this.selected * this.step);
			
			if(this.items[this.selected])
				this.items[this.selected].onSelect();
		}		
		return this.items[this.selected];
	}
}