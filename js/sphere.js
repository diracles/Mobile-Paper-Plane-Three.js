//////////
// interacting with sphere
// ---------------------------
// - has cur and prev X and Y
// - has cur and prev Rot - derived from l in server
// - has a timer - that talks to the lerp and uses incer
// - has an incrementer - called incer that is used for the timer
// - to set new values use only setNewXY and setNewRot, otherwise 
// 		create setters for things you need to manipulate, like color
// - color should be stored on the cubeObject in material and in 
// 		controller for background of canvas


sphere = function() {

		THREE.Object3D.call(this);
		this.init();
		//this.restPos = restPos.clone();
        //this.direction = dir.clone();
        //this.index = mappingIndex;
        this.displace = 0;
        this.vertices = [];
        this.geometry = null;
        this.material = null;
        //shapeMappingData[mappingIndex] = 0;
} 


sphere.prototype = Object.create(THREE.Object3D.prototype);

sphere.prototype.init = function () {

	  var sphere = new THREE.Mesh(new THREE.SphereGeometry(50,50
        ,50), new THREE.MeshNormalMaterial());
    	sphere.overdraw = true;
		this.add(sphere);

		
}


sphere.prototype.ShapeSphere = function () {


	var geo = this.children[0].geometry;
	var faces = geo.faces;
	var vertices = geo.vertices;

	for (var i=0; i<this.vertices.length; i++){

		var geo = this.extrude.vertices;
		var mesh = new THREE.Mesh(geo, resMgr.materials.white);
		this.add(mesh);



	}


	sphere.prototype.extrudeFace = function(index, faces, vertices){
		var geo = new THREE.Geometry();

		var face = faces[index];


	}



	// console.log("im in shape sphere");



	// var force = Math.pow(force*10, 2);
	// console.log("force " + force);
	

	// for (var i=0; i<this.vertices.length; i++){
	// 	this.vertices[i].force;

	// }

	// this.addVertex = function(vert)
 //        {
 //                this.vertices.push(vert);
 //        }

 //        this.isEquals = function(otherPar)
 //        {
 //                //return this.restPos.equals(otherPar.restPos);
 //        }
}



// sphere.prototype.Force = function (force) {






// }