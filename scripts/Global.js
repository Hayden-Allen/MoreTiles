Global = {
	tilesize: 40,	//default width and height of Tiles
	c: document.getElementById("c"),	//canvas
	ctx: c.getContext("2d"),	//canvas draw context
	Flag: {	//list of Tile flag indices and values
		Index: {
			grid: 0,	//is bound to the Scene grid
			movable: 1,	//is movable by rigid Tiles
			ui: 2,	//is a UI element
			destructible: 3,	//can be destroyed by rigid Tiles
			destructive: 4,	//can destroy rigid Tiles
			fromPlayer: 5	//spawned from a player's Item
		},
		Property: {	//same as above, but these are actual values (for or-ing)
			grid: 1,
			movable: 2,
			ui: 4,
			destructible: 8,
			destructive: 16,
			fromPlayer: 32
		}
	},
	controls: [],	//list of Controls to be updated each frame
	keys: new BitSet(0),	//keeps track of keyboard input
	Key: {
		$1: 0xD,	//1
		$2: 0xC,	//2
		$3: 0xB,	//3
		$4: 0xA,	//4
		q: 9,
		e: 8,
		r: 7,
		f: 6,
		c: 5,
		space: 4,
		w: 3,
		a: 2,
		s: 1,
		d: 0
	},
	delta: 0,	//time (in ms) since last frame
	//updated each frame, used to calculate delta
	last: performance.now(),
	now: performance.now(),
	currentScene: undefined,	//Scene being displayed
	lightMax: 15,	//maximum light value for any given Tile
	Mouse: {	//simple mouse object keeping track of coordinates and button presses
		x: 0,
		y: 0,
		//Scene grid coordinates
		tx: 0,
		ty: 0,
		buttons: new BitSet(0),
		Button: {
			left: 0,
			middle: 1,
			right: 2
		}
	}
}
