object = function() {

	this.init();

}


object.prototype = Object.create(THREE.Object3D.prototype);


object.prototype.init = function () {

	var manager = new THREE.LoadingManager();
            manager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );

    };

    var texture = new THREE.Texture();

            var loader = new THREE.ImageLoader( manager );
            loader.load( '/js/whitetexture.jpg"', function ( image ) {
            texture.image = image;
            texture.needsUpdate = true;

    });


    var loader = new THREE.OBJLoader( manager );
            loader.load( '/js/airplane_white.obj"', function ( object ) {

            object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

            child.material.map = texture;

        	}
    	});
    });

}


object.prototype.setPosition = function (x,y) {

		object.position.y = 50;
        console.log("object positon", object.position.y);
        object.position.x = 75;
        console.log("object positon", object.position.x);

}




