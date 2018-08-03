Global = {
	tilesize: 40,
	c: document.getElementById("c"),
	ctx: c.getContext("2d"),
	Flag: {
		Index: {
			grid: 0,
			movable: 1,
			ui: 2,
			destructible: 3,
			destructive: 4,
			fromPlayer: 5
		},
		Property: {
			grid: 1,
			movable: 2,
			ui: 4,
			destructible: 8,
			destructive: 16,
			fromPlayer: 32
		}
	},
	controls: [],
	keys: new BitSet(0),
	Key: {
		$1: 0xD,
		$2: 0xC,
		$3: 0xB,
		$4: 0xA,
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
	delta: 0,
	last: performance.now(),
	now: performance.now(),
	currentScene: undefined,
	lightMax: 15,
	Mouse: {
		x: 0,
		y: 0,
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