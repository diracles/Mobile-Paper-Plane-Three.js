Shaper = function()
{
  
  		THREE.Object3D.call(this);
		this.init();      

}

Shaper.prototype = Object.create(THREE.Object3D.prototype);

Shaper.prototype.init = function () {


        this.radiusTop  =10 ;
        this.radiusBottom = 10;
        this.height = 100;
        this.segmentsRadius = 10;
        this.segmentsHeight = 10;
        this.add(Shaper);


}