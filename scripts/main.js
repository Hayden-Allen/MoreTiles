Global.c.width = window.innerWidth - Global.tilesize;
Global.c.height = window.innerHeight - Global.tilesize;

var gfp = Global.Flag.Property;


var scene1 = new Scene(0);

Tools.tileStretch("assets/tile/grass.png", 0, 0, 15, 15);
/*var fire = new AnimatedTile(
				3, 
				250, 
				"assets/animation/fire.png", 
				7, 
				7, 
				{
					light: 15, 
					rigid: true
				}, 
				new BitSet(gfp.grid | gfp.destructible | gfp.destructive)
			);
*/
var stone = new Tile("", 7, 7, {light: 15}, new BitSet(gfp.grid | gfp.destructible | gfp.destructive));

var sword = new Item(
				"assets/item/sword.png", 
				Global.tilesize / 2, 
				-Global.tilesize / 2,
				100,
				async function(){
					this.tile.addY(-Global.tilesize / 2);
					
					var angle = Tools.toCartesianAngle(player.extra.rotation);
					
					var dir = {
						x: Math.round(Math.sin(player.extra.rotation)),
						y: -Math.round(Math.cos(player.extra.rotation)),
						distance: Global.tilesize / 2
					}
					new Projectile(
						"",
						player.x + Global.tilesize * Math.cos(angle),
						player.y - Global.tilesize * Math.sin(angle),
						Global.tilesize / 2,
						dir,
						{
							rigid: true
						},
						new BitSet(gfp.destructible | gfp.destructive | gfp.fromPlayer)
					);
					
					await Tools.sleep(250);
					
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
					1000,
					async function(angle){
						if(!angle)
							return;
						
						var dir = {
							x: Math.sign(angle.dx),
							y: Math.sign(angle.dy)
						}
						
						if(angle.theta == Math.PI / 2)
							console.log(dir);
						
						var chains = this.extra.radius / Global.tilesize, chain = [], chainstep = this.extra.radius / chains;
						
						for(var i = 0; i < chains; i++)
							chain.push(new Tile(
								"assets/item/chain.png",
								player.x + Math.cos(angle.theta) * chainstep * (i + 1),
								player.y - Math.sin(angle.theta) * chainstep * (i + 1),
								{
									grid: false
								},
								new BitSet(gfp.fromPlayer)
							));
						
						if(dir.x)
							(new Projectile(
								"",
								player.x - dir.x * Global.tilesize,
								player.y,
								this.extra.speed,
								{
									x: angle.cos,
									y: -angle.sin,
									distance: this.extra.radius
								},
								{
									grid: false,
									rigid: true
								},
								new BitSet(gfp.fromPlayer)
							)).onDestroy = function(){
								chain.forEach(function(c){
									Global.currentScene.remove(c);
								});
							}
						if(dir.y)
							(new Projectile(
								"",
								player.x,
								player.y - dir.y * Global.tilesize,
								this.extra.speed,
								{
									x: angle.cos,
									y: -angle.sin,
									distance: this.extra.radius,
								},
								{
									grid: false,
									rigid: true
								},
								new BitSet(gfp.fromPlayer)
							)).onDestroy = function(){
								chain.forEach(function(c){
									Global.currentScene.remove(c);
								});
							}
					},
					{
						w: .5,
						h: .5,
						radius: 6 * Global.tilesize,
						speed: 30,
						onSelect: function(){
							this.cursor = new AnimatedTile(
												2, 
												250, 
												"assets/animation/cursor_green.png", 
												0,
												0, 
												{
													grid: false
												}, 
												new BitSet(gfp.fromPlayer | gfp.ui)
											);
							this.cursor.controls = new Controls(this.cursor, {item: this, radius: this.extra.radius}, function(){
								var angle = Tools.angle(Tools.toTileCoord(Global.Mouse.x) + Global.tilesize / 2, 
														Tools.toTileCoord(Global.Mouse.y) + Global.tilesize / 2,
														Tools.toTileCoord(player.x) + player.w / 2, 
														Tools.toTileCoord(player.y) + player.h / 2);	
								
								var x = player.center.x - Global.Mouse.x, signx = Math.sign(x);
								var xmax = signx * angle.cos * this.extra.radius;
								if(-signx * x < xmax)
									x = -signx * xmax;
								
								var y = player.center.y - Global.Mouse.y, signy = Math.sign(y);
								var ymax = -signy * this.extra.radius * angle.sin;
								if(-signy * y < ymax)
									y = -signy * ymax;
								
								this.target.setX(camera.offx + Tools.toTileCoord(player.x + player.w / 2 - x));
								this.target.setY(camera.offy + Tools.toTileCoord(player.y + player.w / 2 - y));
								
								/*new Tile("assets/tile/stone.png", parseInt((player.center.x - x) / Global.tilesize) * Global.tilesize,
									parseInt((player.center.y - y) / Global.tilesize) * Global.tilesize, {grid: false}, new BitSet(gfp.fromPlayer));
								*/
								if(Global.Mouse.buttons.at(Global.Mouse.Button.left)){
									this.unbind();
									this.extra.item.canAttack = true;
									this.extra.item.use(angle);
									this.extra.item.onDeselect();
								}
							});
						},
						onDeselect: function(){
							if(this.cursor){
								Global.currentScene.remove(this.cursor);
								this.cursor.controls.unbind();
								this.cursor = null;
							}
						},
						postCooldown: function(){
							this.onSelect();
						}
					}
				);
var shield = new Item(
				"assets/item/shield_inactive.png",
				Global.tilesize / 4, 
				Global.tilesize / 4,
				1000,
				async function(){
					var cur = player.extra.rotation, end = parseFloat((cur + Math.PI).toFixed(4));
					var tiles = [];
					var step = Math.PI / 15, radius = Global.tilesize * 2.25;
					
					//cur += step * 12;
					cur -= step;
					end -= step;
					
					while(cur < end){
						cur += step;
						tiles.push(new Tile(
										"assets/item/shield_active.png",
										player.center.x - radius * Math.cos(cur) - Global.tilesize / 4,
										player.center.y - radius * Math.sin(cur) - Global.tilesize / 4,
										{
											rigid: true,
											w: .5,
											h: .5
										},
										new BitSet(gfp.fromPlayer)
									));
						cur = parseFloat(cur.toFixed(4));
					}
					
					await Tools.sleep(3000);
					tiles.forEach(function(t){Global.currentScene.remove(t);});
				},
				{
					w: .5,
					h: .5
				}
			);
			
var player = new Character(
				"assets/tile/player.png",
				14 * Global.tilesize, 
				12 * Global.tilesize, 
				10,
				new Inventory([grapple, shield, bow, ballandchain, sword]), 
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

var camera = new Camera(player);
var renderer = new Renderer();

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
var canvasBoundingRect = Global.c.getBoundingClientRect();
window.onmousemove = function(e){
	Global.Mouse.x = Tools.clamp(e.clientX - canvasBoundingRect.x, 0, Global.c.width) - camera.offx;
	Global.Mouse.y = Tools.clamp(e.clientY - canvasBoundingRect.y, 0, Global.c.height) - camera.offy;
	Global.Mouse.tx = parseInt(Global.Mouse.x / Global.tilesize) * Global.tilesize;
	Global.Mouse.ty = parseInt(Global.Mouse.y / Global.tilesize) * Global.tilesize;
}
window.onmousedown = function(e){
	e.preventDefault();
	Global.Mouse.buttons.set(e.button, true);
}
window.onmouseup = function(e){
	Global.Mouse.buttons.set(e.button, false);
}
window.oncontextmenu = function(e){
	e.preventDefault();
}