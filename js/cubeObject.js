//////////
// interacting with cubeplayer
// ---------------------------
// - has cur and prev X and Y
// - has cur and prev Rot - derived from l in server
// - has a timer - that talks to the lerp and uses incer
// - has an incrementer - called incer that is used for the timer
// - to set new values use only setNewXY and setNewRot, otherwise 
// 		create setters for things you need to manipulate, like color
// - color should be stored on the cubeObject in material and in 
// 		controller for background of canvas

cubePlayer = function()
{
	THREE.Object3D.call(this);
	this.init();
	this.geometry = null;
	this.material = null;
	this.cube = null;
	this.curX = null;
	this.curY = null;
	this.prevX = null;
	this.prevY = null;
	this.curRot = null;
	this.prevRot = null;
	this.timer = 0;
	this.incer = 0;
	this.ready = false;
}

cubePlayer.prototype = Object.create(THREE.Object3D.prototype);

cubePlayer.prototype.init = function()
{
	var geometry = new THREE.CubeGeometry(0,0,0);
	var material = new THREE.MeshLambertMaterial({ambient: 0x404040, color: 0x00ff00, specular: 0x009900, shininess: 30, shading: THREE.SmoothShading });
	//var light = new THREE.AmbientLight( 0x404040 );
	var cube = new THREE.Mesh(geometry, material);

	var that = this;

	this.add(cube);
	this.geometry = geometry;
	this.material = material;
	this.cube = cube;

	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};

	var loader = new THREE.OBJLoader( manager );
	loader.load( '/js/airplane_white.obj', function ( object ) {
		that.add(object);
		that.cube = object;
		that.ready = true;
	});
}

cubePlayer.prototype.calcTouch = function(playerData) {
	// check to see if id is correct
    this.setNewXY(playerData.dx * 100, playerData.dy * 100);
    this.setNewRot(playerData.l);
}

cubePlayer.prototype.setNewRot = function(rotation) {
	this.prevRot = this.curRot;
	this.curRot = rotation;
}

cubePlayer.prototype.startTimer = function() {
	console.log("I'm in cubePlayer startTimer");
	console.log(this.cube.id);
	this.timer = 0;
	this.incer = 0;
}

cubePlayer.prototype.incTimer = function() {
	this.incer+=.01;
	this.timer = this.incer*this.incer;
	if(this.timer>1.)this.timer=1.;
}

cubePlayer.prototype.setNewXY = function(x, y) {
	this.prevX = this.cube.position.x;
	this.prevY = this.cube.position.y;
	this.curX = x;
	this.curY = y;
}



