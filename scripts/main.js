//resize canvas
Global.c.width = window.innerWidth - Global.tilesize;
Global.c.height = window.innerHeight - Global.tilesize;

var gfp = Global.Flag.Property;	//shortcut

var scene1 = new Scene(0);

Tools.tileStretch("assets/tile/grass.png", 0, 0, 15, 15);	//background
//light that destroys destructible Tiles and can be destroyed by destructive Tiles
var stone = new Tile("", 7, 7, {light: 15}, new BitSet(gfp.grid | gfp.destructible | gfp.destructive));

var sword = new Item(	//sword that the player can stab with
				"assets/item/sword.png",
				//coordinate offsets
				Global.tilesize / 2,
				-Global.tilesize / 2,
				100,	//100 ms between uses
				async function(){
					this.tile.addY(-Global.tilesize / 2);	//move up

					var angle = Tools.toCartesianAngle(player.extra.rotation);	//angle player is facing

					var dir = {
						x: Math.round(Math.sin(player.extra.rotation)),
						y: -Math.round(Math.cos(player.extra.rotation)),
						distance: Global.tilesize / 2	//max distance for projectile to travel
					};
					new Projectile(	//create Projectile to represent the sword strike
						"",
						player.x + Global.tilesize * Math.cos(angle),
						player.y - Global.tilesize * Math.sin(angle),
						Global.tilesize / 2,	//half a tile per second
						dir,
						{
							rigid: true
						},
						new BitSet(gfp.destructible | gfp.destructive | gfp.fromPlayer)	//destroys and is destroyable, spawned from player
					);

					await Tools.sleep(250);	//wait .25 seconds

					this.tile.addY(Global.tilesize / 2);	//move back down
				},
				{
					rigid: true,	//interacts with other Tiles
					w: .5	//tilesize / 2 wide
				},
				new BitSet(gfp.destructive)	//sword destroys things
			);
var ballandchain = new Item(	//ball that swings around the player and destroys Tiles
						"assets/item/chain.png",
						//no offsets
						0,
						0,
						250,	//.25 seconds between uses
						async function(){
							var radius = Global.tilesize * 2;	//distance between ball and player
							var cur = Tools.toCartesianAngle(player.extra.rotation);	//current angle
							var end = cur - Math.PI * 2;	//end angle (1 full revolution)
							var step = Math.PI / 15;	//amount to add to angle each update

							var ball = new Tile(
											"assets/item/ball.png",
											//coordinates based on direction player is facing
											player.x + Math.cos(cur) * radius,
											player.y - Math.sin(cur) * radius,
											{
												rigid: true
											},
											new BitSet(gfp.destructive | gfp.fromPlayer)	//can destroy other Tiles
										);
							var chain = [];	//list of chain Tiles
							var chains = 3;	//number of chain Tiles
							var chainstep = radius / chains;	//distance between consecutive chain links

							for(var i = 0; i < chains; i++)	//generate chains and store in lsit
								chain.push(new Tile(
												"assets/item/chain.png",
												//increment position by chainstep for each consecutive chain
												player.x + Math.cos(cur) * chainstep * (i + 1),
												player.y - Math.sin(cur) * chainstep * (i + 1),
												{},
												new BitSet(gfp.fromPlayer)
											));

							while(cur > end){
								cur -= step;	//move towards target angle

								//update ball position
								ball.setX(player.x + Math.cos(cur) * radius);
								ball.setY(player.y - Math.sin(cur) * radius);
								//update chain positions
								for(var i = 0; i < chains; i++){
									chain[i].setX(player.x + Math.cos(cur) * chainstep * (i + 1));
									chain[i].setY(player.y - Math.sin(cur) * chainstep * (i + 1));
								}
								await Tools.sleep(15);	//wait a bit before next movement
							}
							await Tools.sleep(15);

							//delete
							Global.currentScene.remove(ball);
							chain.forEach(function(c){Global.currentScene.remove(c);});
						}
					);
var bow = new Item(	//shoots arrows
				"assets/item/bow.png",
				//no offsets
				0,
				0,
				500,	//half a second between shots
				async function(){
					//direction to shoot in
					var sin = Math.round(Math.sin(player.extra.rotation));
					var cos = -Math.round(Math.cos(player.extra.rotation));

					var p = new Projectile(
						"assets/item/arrow.png",
						//start in position based on rotation
						player.x + Global.tilesize * sin,
						player.y + Global.tilesize * cos,
						15,	//15 tiles/second
						{	//direction
							x: sin,
							y: cos
						},
						{
							rotation: player.extra.rotation,	//make sure texture is facing right direction too
							rigid: true
						},
						new BitSet(gfp.destructible | gfp.destructive | gfp.fromPlayer)
					);
				}
			);
var grapple = new Item(	//grappling hook that pulls the player to a selected location
					"assets/tile/stone.png",	//icon texture
					//display in center of player
					Global.tilesize / 4,
					Global.tilesize / 4,
					1000,	//1 second cooldown
					async function(cursor){
						var angle = cursor.angle;
						if(!angle)
							return;

						var dir = {
							x: Math.sign(angle.dx),
							y: Math.sign(angle.dy)
						}

						//distance clamped to allowed radius
						var dist = Math.min(this.extra.radius,
											Tools.distance(player.x, player.y, cursor.x * Global.tilesize, cursor.y * Global.tilesize));

						var chains = this.extra.radius / Global.tilesize * 2;	//2 chains per Tile
						var chain = [];	//list of chains
						var chainstep = dist / chains;	//chain coordinate increment

						//generate and store chain links
						for(var i = 0; i < chains; i++)
							chain.push(new Tile(
								"assets/item/chain.png",
								//increment by chainstep for each consecutive chain
								player.x + Math.cos(angle.theta) * chainstep * (i + 1),
								player.y - Math.sin(angle.theta) * chainstep * (i + 1),
								{
									grid: false
								},
								new BitSet(gfp.fromPlayer)
							));

						//projectile used to push player along x axis
						if(dir.x)
							(new Projectile(
								"",
								player.x - dir.x * Global.tilesize,
								player.y,
								this.extra.speed,
								{
									x: angle.cos,
									y: -angle.sin,
									distance: dist
								},
								{
									grid: false,
									rigid: true	//so that it can push player
								},
								new BitSet(gfp.fromPlayer)
							)).onDestroy = function(){	//when distance reached, delete
								chain.forEach(function(c){
									Global.currentScene.remove(c);
								});
							}
						//used to push player along y axis
						if(dir.y)
							(new Projectile(
								"",
								player.x,
								player.y - dir.y * Global.tilesize,
								this.extra.speed,
								{
									x: angle.cos,
									y: -angle.sin,
									distance: dist
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
						//half tilesize wide and tall
						w: .5,
						h: .5,
						//maximum of 6 Tiles travelled
						radius: 6 * Global.tilesize,
						speed: 15,	//moves player at 15 tiles/sec
						onSelect: function(){	//bring up cursor to select location
							this.cursor = new AnimatedTile(
												2,	//2 frames
												250,	//.25 seconds per cycle
												"assets/animation/cursor_green.png",
												//starts at 0, 0
												0,
												0,
												{
													grid: false
												},
												new BitSet(gfp.fromPlayer | gfp.ui)
											);
							this.cursor.controls = new Controls(this.cursor, {item: this, radius: this.extra.radius}, function(){
								//angle between player and cursor
								var angle = Tools.angle(Tools.toTileCoord(Global.Mouse.x) + Global.tilesize / 2,
														Tools.toTileCoord(Global.Mouse.y) + Global.tilesize / 2,
														Tools.toTileCoord(player.x) + player.w / 2,
														Tools.toTileCoord(player.y) + player.h / 2);

								var x = player.center.x - (Global.Mouse.x + Global.tilesize / 2), signx = Math.sign(x);
								var xmax = signx * angle.cos * this.extra.radius;
								var y = player.center.y - (Global.Mouse.y + Global.tilesize / 2), signy = Math.sign(y);
								var ymax = this.extra.radius * angle.sin;

								//bound coordinates to circle defined by radius property
								if(signy == 1 && y > ymax)
									y = ymax;
								if(signy == -1 && y < ymax)
									y = ymax;
								if(signx == 1 && x > -xmax)
									x = -xmax;
								if(signx == -1 && x < xmax)
									x = xmax;

								//update position to reflect mouse movements
								this.target.setX(camera.offx + Tools.toTileCoord(player.x + player.w / 2 - (x + Global.tilesize / 2)));
								this.target.setY(camera.offy + Tools.toTileCoord(player.y + player.w / 2 - (y + Global.tilesize / 2)));

								if(Global.Mouse.buttons.at(Global.Mouse.Button.left)){	//on left click
									this.unbind();	//delete these controls
									this.extra.item.use({angle: angle, x: Global.Mouse.tx, y: Global.Mouse.ty});	//use grapple
									this.extra.item.onDeselect();	//delete cursor
								}
							});
						},
						onDeselect: function(){
							if(this.cursor)
								Global.currentScene.remove(this.cursor);
						},
						postCooldown: function(){	//reset cursor after cooldown
							this.onSelect();
						}
					}
				);
var shield = new Item(	//generates a semicircle of shield Tiles in front of player
				"assets/item/shield_inactive.png",
				//displayed in center of player
				Global.tilesize / 4,
				Global.tilesize / 4,
				1000,	//1 second cooldown
				async function(){
					var cur = player.extra.rotation, end = cur + Math.PI;	//current angle, target angle
					var tiles = [];	//list of shield Tiles
					var step = Math.PI / 15;	//cur increment
					var radius = Global.tilesize * 2.25;

					//make slightly less than semicircle
					cur -= step;
					end -= step;

					while(cur < end){
						cur += step;	//increment current angle
						//create new shield Tile
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
						await Tools.sleep(20);	//wait a bit to create next Tile
					}

					await Tools.sleep(3000);	//leave shield up for 3 seconds
					tiles.forEach(function(t){Global.currentScene.remove(t);});	//delete all
				},
				{
					//display in center of player
					w: .5,
					h: .5
				}
			);

var player = new Character(
				"assets/tile/player.png",
				//starting coordinates
				14 * Global.tilesize,
				12 * Global.tilesize,
				10,	//speed
				new Inventory([grapple, shield, bow, ballandchain, sword]),	//all Items
				{
					rigid: true,
					add: false
				},
				new BitSet(gfp.movable)	//can be moved by other rigid Tiles
			);
player.controls = new Controls(player, {speed: player.speed, slowSpeed: player.speed / Math.sqrt(2)}, function(keys){
	//if multiple direction keys pressed, use slower speed
	var speed = (new BitSet(0b1111 & keys.value)).log2() ? this.extra.speed : this.extra.slowSpeed;

	//update position
	this.target.addX(Global.delta * speed * (keys.at(Global.Key.d) - keys.at(Global.Key.a)));
	this.target.addY(Global.delta * speed * (keys.at(Global.Key.s) - keys.at(Global.Key.w)));

	var bounds = Global.currentScene.bounds;

	//clamp to Scene boundaries
	this.target.setX(Tools.clamp(this.target.x, bounds.left, bounds.right - this.target.w));
	this.target.setY(Tools.clamp(this.target.y, bounds.top, bounds.bottom - this.target.h));

	if(keys.at(Global.Key.space) && this.target.equipped)	//use current Item
		this.target.equipped.use();
	if(keys.value >= Math.pow(2, Global.Key.c))	//equip Item
		this.target.equip((Global.Key.$1 - Global.Key.c + 1) - (parseInt(Math.log2(keys.value)) - (Global.Key.c - 1)));
});

var camera = new Camera(player);	//follow player around
var renderer = new Renderer();

scene1.finalize();	//generate lightMap

var debug = new DebugInfo();	//for display under canvas
function update(){
	Tools.clearScreen();	//clear screen, draw background, update delta

	renderer.render(scene1, camera);	//draw everything

	//update and display debug string
	debug.update(player.x, player.y, renderer.sprites, renderer.minSprites, renderer.maxSprites, 1000 / Global.delta);
	Tools.debug("debug", debug.string());

	//update all controls
	Global.controls.forEach(function(c){
		c.update(Global.keys);
	});
}
update();

//handle all keyboard input
window.onkeydown = function(e){
	if(e.keyCode !== 123)	//f12 - console
		e.preventDefault();
	switch(e.keyCode){
	case 49: Global.keys.set(Global.Key.$1, true); break;	//1
	case 50: Global.keys.set(Global.Key.$2, true); break;	//2
	case 51: Global.keys.set(Global.Key.$3, true); break;	//3
	case 52: Global.keys.set(Global.Key.$4, true); break;	//4
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
//handle mouse input
var canvasBoundingRect = Global.c.getBoundingClientRect();
window.onmousemove = function(e){
	//get mouse position relative to canvas and convert to world coordinates
	Global.Mouse.x = Tools.clamp(e.clientX - canvasBoundingRect.x, 0, Global.c.width) - camera.offx;
	Global.Mouse.y = Tools.clamp(e.clientY - canvasBoundingRect.y, 0, Global.c.height) - camera.offy;
	Global.Mouse.tx = parseInt(Global.Mouse.x / Global.tilesize);
	Global.Mouse.ty = parseInt(Global.Mouse.y / Global.tilesize);
}
window.onmousedown = function(e){
	Global.Mouse.buttons.set(e.button, true);
}
window.onmouseup = function(e){
	Global.Mouse.buttons.set(e.button, false);
}
window.oncontextmenu = function(e){	//prevent right click menu
	e.preventDefault();
}
