Global.c.style = "border: 1px solid black;";
Global.c.width = window.innerWidth - 40;
Global.c.height = window.innerHeight - 40;

var gfp = Global.Flag.Property;


var scene1 = new Scene(0);

Tools.tileStretch("assets/tile/grass.png", 0, 0, 15, 15);
var fire = new AnimatedTile(3, 250, "assets/animation/fire.png", 7, 7, {light: 15, rigid: true}, new BitSet(gfp.movable | gfp.grid));

var player = new Character(
				"assets/tile/player.png",
				6 * Global.tilesize, 
				7 * Global.tilesize, 
				10,
				{
					rigid: true
				},
				new BitSet(0)
			);

player.controls = new Controls(player, {speed: player.speed, slowSpeed: player.speed / Math.sqrt(2)}, function(keys){
	var speed = keys.log2() ? this.extra.speed : this.extra.slowSpeed;
		
	this.target.addX(Global.delta * speed * (keys.at(Global.Key.d) - keys.at(Global.Key.a)));
	this.target.addY(Global.delta * speed * (keys.at(Global.Key.s) - keys.at(Global.Key.w)));
	
	var bounds = Global.currentScene.bounds;
	
	this.target.setX(Tools.clamp(this.target.x, bounds.left, bounds.right - this.target.w));
	this.target.setY(Tools.clamp(this.target.y, bounds.top, bounds.bottom - this.target.h));
});

var camera = new Camera(player);
var renderer = new Renderer();

scene1.finalize();

function update(){
	Tools.clearScreen();
	
	renderer.render(scene1, camera);
	
	Tools.debug("debug", player.x + ", " + player.y);
	
	Global.controls.forEach(function(c){
		c.update(Global.keys);
	});
}
update();

window.onkeydown = function(e){
	//console.log(e.keyCode);
	switch(e.keyCode){
	case 87: Global.keys.set(Global.Key.w, true); break;
	case 65: Global.keys.set(Global.Key.a, true); break;
	case 83: Global.keys.set(Global.Key.s, true); break;
	case 68: Global.keys.set(Global.Key.d, true); break;
	}
}
window.onkeyup = function(e){
	switch(e.keyCode){
	case 87: Global.keys.set(Global.Key.w, false); break;
	case 65: Global.keys.set(Global.Key.a, false); break;
	case 83: Global.keys.set(Global.Key.s, false); break;
	case 68: Global.keys.set(Global.Key.d, false); break;
	}
}