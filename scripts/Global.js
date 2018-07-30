Global = {
	tilesize: 40,
	c: document.getElementById("c"),
	ctx: c.getContext("2d"),
	Flag: {
		Index: {
			grid: 0,
			movable: 1
		},
		Property: {
			grid: 1,
			movable: 2
		}
	},
	controls: [],
	keys: new BitSet(0),
	Key: {
		w: 3,
		a: 2,
		s: 1,
		d: 0
	},
	delta: 0,
	last: performance.now(),
	now: performance.now(),
	currentScene: undefined,
	lightMax: 15
}