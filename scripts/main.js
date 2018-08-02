Global.c.width = window.innerWidth - 40;
Global.c.height = window.innerHeight - 40;

var gfp = Global.Flag.Property;


var scene1 = new Scene(0);

Tools.tileStretch("assets/tile/grass.png", 0, 0, 15, 15);
var fire = new AnimatedTile(
				3, 
				250, 
				"assets/animation/fire.png", 
				7, 
				7, 
				{
					light: 15, 
					rigid: true
				}, 
				new BitSet(gfp.movable | gfp.grid | gfp.destructible | gfp.destructive)
			);

var sword = new Item(
				"assets/item/sword.png", 
				Global.tilesize / 2, 
				-Global.tilesize / 2,
				100,
				async function(){
					this.tile.addY(-Global.tilesize / 2);
					
					var angle = Tools.toCartesianAngle(player.extra.rotation);
					
					var hitbox = new Tile(
									"assets/tile/stone.png", 
									player.x + Global.tilesize * Math.cos(angle), 
									player.y - Global.tilesize * Math.sin(angle), 
									{
										rigid: true
									}, 
									new BitSet(gfp.destructive | gfp.fromPlayer)
								);
					
					await Tools.sleep(250);
					Global.currentScene.remove(hitbox);
					
					this.tile.addY(Global.tilesize / 2);
				},
				{
					rigid: true,
					w: .5
				},
				new BitSet(gfp.destructive)
			);
var ballandchain = new Item(
						"assets/item/chain.png",
						0,
						0,
						250,
						async function(){
							var radius = Global.tilesize * 2;
							var cur = Tools.toCartesianAngle(player.extra.rotation);
							var end = cur - Math.PI * 2;
							var step = Math.PI / 15;
														
							var ball = new Tile(
											"assets/item/ball.png",
											player.x + Math.cos(cur) * radius, 
											player.y - Math.sin(cur) * radius,
											{
												rigid: true
											},
											new BitSet(gfp.destructive | gfp.fromPlayer)
										);
							var chain = [], chains = 3, chainstep = radius / chains;
							
							for(var i = 0; i < chains; i++)
								chain.push(new Tile(
												"assets/item/chain.png",
												player.x + Math.cos(cur) * chainstep * (i + 1),
												player.y - Math.sin(cur) * chainstep * (i + 1),
												{},
												new BitSet(gfp.fromPlayer)
											));
							
							
							while(cur > end){
								cur -= step;
								
								ball.setX(player.x + Math.cos(cur) * radius);
								ball.setY(player.y - Math.sin(cur) * radius);
								
								for(var i = 0; i < chains; i++){
									chain[i].setX(player.x + Math.cos(cur) * chainstep * (i + 1));
									chain[i].setY(player.y - Math.sin(cur) * chainstep * (i + 1));
								}
								
								await Tools.sleep(15);
							}
							
							await Tools.sleep(5);
							
							Global.currentScene.remove(ball);
							chain.forEach(function(c){Global.currentScene.remove(c);});
						}
					);
var bow = new Item(
				"assets/item/bow.png",
				0,
				0,
				500,
				async function(){
					var sin = Math.round(Math.sin(player.extra.rotation));
					var cos = -Math.round(Math.cos(player.extra.rotation));
					
					var p = new Projectile(
						"assets/item/arrow.png",
						player.x + Global.tilesize * sin,
						player.y + Global.tilesize * cos,
						15,
						{
							x: sin,
							y: cos,
							distance: 10 * Global.tilesize
						},
						{
							rotation: player.extra.rotation,
							rigid: true
						},
						new BitSet(gfp.destructible | gfp.destructive | gfp.fromPlayer)
					);
				}
			);
var grapple = new Item(
					"assets/tile/stone.png",
					Global.tilesize / 4,
					Global.tilesize / 4,
					250,
					async function(){
						var x = Math.round(Math.sin(player.extra.rotation));
						var y = -Math.round(Math.cos(player.extra.rotation));
						var distance = 4;
						
						/*new Tile(
							"assets/tile/stone.png",
							player.x + distance * x * Global.tilesize,
							player.y + distance * y * Global.tilesize,
							{
								rigid: true
							},
							new BitSet(gfp.destructive | gfp.destructible | gfp.fromPlayer)
						);*/
						new Projectile(
							"assets/item/arrow.png",
							player.x - x * Global.tilesize + Global.tilesize / 4,
							player.y - y * Global.tilesize,
							2, 
							{
								x: x, 
								y: y,
								distance: distance * Global.tilesize
							},
							{
								w: .5, 
								h: .5,
								rigid: true
							},
							new BitSet(gfp.fromPlayer)//gfp.destructive | gfp.destructible | gfp.fromPlayer)
						);
					},
					{
						w: .5,
						h: .5
					}
				);
			
			
var player = new Character(
				"assets/tile/player.png",
				6 * Global.tilesize, 
				7 * Global.tilesize, 
				10,
				new Inventory([grapple, bow, ballandchain, sword]), 
				{
					rigid: true,
					add: false
				},
				new BitSet(gfp.movable)
			);
player.controls = new Controls(player, {speed: player.speed, slowSpeed: player.speed / Math.sqrt(2)}, function(keys){
	var speed = (new BitSet(0b1111 & keys.value)).log2() ? this.extra.speed : this.extra.slowSpeed;
		
	this.target.addX(Global.delta * speed * (keys.at(Global.Key.d) - keys.at(Global.Key.a)));
	this.target.addY(Global.delta * speed * (keys.at(Global.Key.s) - keys.at(Global.Key.w)));
	
	var bounds = Global.currentScene.bounds;
	
	this.target.setX(Tools.clamp(this.target.x, bounds.left, bounds.right - this.target.w));
	this.target.setY(Tools.clamp(this.target.y, bounds.top, bounds.bottom - this.target.h));
	
	if(keys.at(Global.Key.space) && this.target.equipped)
		this.target.equipped.use();
	if(keys.value >= Math.pow(2, Global.Key.c))
		this.target.equip((Global.Key.$1 - Global.Key.c + 1) - (parseInt(Math.log2(keys.value)) - (Global.Key.c - 1)));
});

console.log(scene1.objects);

var camera = new Camera(player);
var renderer = new Renderer();

console.log(scene1.rigids);

scene1.finalize();

var debug = new DebugInfo();
function update(){
	Tools.clearScreen();
	
	renderer.render(scene1, camera);
	
	debug.update(player.x, player.y, renderer.sprites, renderer.minSprites, renderer.maxSprites, 1000 / Global.delta);
	Tools.debug("debug", debug.string());
	
	Global.controls.forEach(function(c){
		c.update(Global.keys);
	});
}
update();

window.onkeydown = function(e){
	if(e.keyCode !== 123)	//f12 - console
		e.preventDefault();
	
	//console.log(e.keyCode);
	switch(e.keyCode){
	case 49: Global.keys.set(Global.Key.$1, true); break;
	case 50: Global.keys.set(Global.Key.$2, true); break;
	case 51: Global.keys.set(Global.Key.$3, true); break;
	case 52: Global.keys.set(Global.Key.$4, true); break;
	case 81: Global.keys.set(Global.Key.q, true); break;
	case 69: Global.keys.set(Global.Key.e, true); break;
	case 82: Global.keys.set(Global.Key.r, true); break;
	case 70: Global.keys.set(Global.Key.f, true); break;
	case 67: Global.keys.set(Global.Key.c, true); break;
	case 32: Global.keys.set(Global.Key.space, true); break;		
	case 87: Global.keys.set(Global.Key.w, true); player.setRotation(0); break;
	case 65: Global.keys.set(Global.Key.a, true); player.setRotation(Math.PI * 1.5); break;
	case 83: Global.keys.set(Global.Key.s, true); player.setRotation(Math.PI); break;
	case 68: Global.keys.set(Global.Key.d, true); player.setRotation(Math.PI / 2); break;
	}
}
window.onkeyup = function(e){
	switch(e.keyCode){
	case 49: Global.keys.set(Global.Key.$1, false); break;
	case 50: Global.keys.set(Global.Key.$2, false); break;
	case 51: Global.keys.set(Global.Key.$3, false); break;
	case 52: Global.keys.set(Global.Key.$4, false); break;
	case 81: Global.keys.set(Global.Key.q, false); break;
	case 69: Global.keys.set(Global.Key.e, false); break;
	case 82: Global.keys.set(Global.Key.r, false); break;
	case 70: Global.keys.set(Global.Key.f, false); break;
	case 67: Global.keys.set(Global.Key.c, false); break;	
	case 32: Global.keys.set(Global.Key.space, false); break;	
	case 87: Global.keys.set(Global.Key.w, false); break;
	case 65: Global.keys.set(Global.Key.a, false); break;
	case 83: Global.keys.set(Global.Key.s, false); break;
	case 68: Global.keys.set(Global.Key.d, false); break;
	}
}