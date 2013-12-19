var lengthV = 0;
var directX = 0;
var directY = 0;
var position;
var players = [];
var playerNumber;
var playerData;
var scene;
var cube;
//var cube;

//array of cube players

var renderer = null;
var scene = null;
var controls = null;
var camera = null;
var clock = null;
var animating = true;
var resMgr = null;
var keyPressed = [];
var exporter = {};
var testObject = {};

    
var socket = io.connect('http://ec2-54-200-30-241.us-west-2.compute.amazonaws.com:8080');

socket.on('connect', function() {
    
});

// Receive from any event
socket.on('updateUserTouch', function (playerData) {
    console.log("I'm in calcTouch, fired from server");
    for (var i = 0; i < players.length; i++) {
        console.log("player" + i, players[i])

        if(playerData.id === players[i].id) {
            players[i].startTimer();
            var singlePlayer = players[i];
            console.log("I've foundthe player about to emit calcTouch");
            console.log(playerData);
            console.log(singlePlayer);
            singlePlayer.calcTouch(playerData);
        }
    };
});

socket.on('players', function (data) {
    if (data.type == "display") {
            console.log('this browser is the main display');
            //yes, firing
    }
});


function updatePlayer(playerData) {

}

socket.on('createPlayer', function (playerData) {
    //console.log("i'm in createPlayer");
    console.log(playerData);
    populateScene(playerData);
    populateScene(sphere);
});


socket.on('leave', function (data) {
    //console.log("Removed character with ID: " + position);
});

//***************************************************************************//
// Init Canvas                                                               //
//***************************************************************************//
var initcanvas = function() {
    // Grab our container div
    var container = document.getElementById("container");
    // Create the Three.js renderer, add it to our div
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0);
    container.appendChild( renderer.domElement );
    // Create a new Three.js scene
    scene = new THREE.Scene();
    // Put in a camera
    camera = new THREE.PerspectiveCamera( 20, 
        window.innerWidth / window.innerHeight, 1, 10000 );
        
    //define position of camera
    camera.position.set( 0, 0, 1000);
    //tilt and orient camera
    //define target
    camera.lookAt(0, 0, 0);
    //z is which way the camera is pointing + up vector
    controls = new THREE.OrbitControls(camera);
    //controls.addEventListener( 'change', render );
    // add lights
    initSceneLights();

    scene.add(sphere);
    // scene specific stuff (add objects)
     populateSceneSphere();
    // Add a mouse up handler to toggle the animation
    addInputHandler();
    window.addEventListener( 'resize', onWindowResize, false );
    // add gui
    //addGui();
    clock = new THREE.Clock();


    //objloader



    // init keyPressed
    for (var i=0; i<255; i++)
    {
        keyPressed[i] = false;
    }
    // Run our render loop
    run();


    
}

var t= -2 * Math.PI;
var lengthOfAnimation = 100;

function lerp(start, finish, amnt){
    var amount = start + (finish-start)*amnt;
    return amount;
}

function run()
{
    requestAnimationFrame(run);
    controls.update();


    var deltaMS = clock.getDelta()*1000;
    for (var i = 0; i < players.length; i++) {
        if(players[i].ready) { 

            if(players[i].timer < 1.0) {
                players[i].incTimer();
                var incx = lerp(players[i].prevX, players[i].curX, players[i].timer);
                var incy = lerp(players[i].prevY, players[i].curY, players[i].timer);
                //console.log(incx, incy);

                players[i].cube.position.x = incx;
                players[i].cube.position.y = incy;
                players[i].cube.rotation.x = lerp(players[i].prevRot, players[i].curRot, players[i].timer)*(Math.PI/180);
            }
        }
    }
    render();
    //console.log("in run");
}

// Render the scene
function render()
{
    renderer.render(scene, camera);    
}

//***************************************************************************//
// Populate the scene with lights                                            //
//***************************************************************************//
function initSceneLights()
{
    // Create an ambient and a directional light to show off the object
    var dirLight = [];
    var ambLight = new THREE.AmbientLight( 0xaaaaaa ); // soft white light
    dirLight[0] = new THREE.DirectionalLight( 0xffffff, 1);
    dirLight[0].position.set(0, 1, 1);
    dirLight[1] = new THREE.DirectionalLight( 0xbbbbbb, 1);
    dirLight[1].position.set(0, -1, -1);

    scene.add( ambLight );
    scene.add( dirLight[0] );
    scene.add( dirLight[1] );
}

//***************************************************************************//
// Populate the scene object with our objects                                //
//***************************************************************************//
function populateScene(playerData)
{
    //console.log("I'm in populateScene");
    //attach playerId to the cube
    cube = new cubePlayer();
    cube.init();
    cube.id = playerData.id;
    var sinX = (Math.sin(players.length) * 10);
    var cosY = (Math.cos(players.length) * 10);
    var posX = ( (window.innerWidth / 2) - sinX ) * .1;
    var posY = ( (window.innerHeight / 2) - cosY ) * .1;
    console.log("posX: " + posX, "posY: " + posY);
    cube.position.x = posX;
    cube.position.y = posY;
    cube.setNewXY(cube.position.x, cube.position.y);
    console.log(playerData);
    console.log(cube);
    players.push(cube);
    scene.add(cube);
}

function populateSceneSphere(){


    sphere = new sphere();
    sphere.init();
    scene.add(sphere);

}


// function loadShader(shadertype) {
//   return document.getElementById(shadertype).textContent;
// }



// function createShaderMaterial(id, light, ambientLight) {

//     var shaderTypes = {

//         'phongBalanced' : {

//             uniforms: {

//                 "uDirLightPos": { type: "v3", value: new THREE.Vector3() },
//                 "uDirLightColor": { type: "c", value: new THREE.Color( 0xffffff ) },

//                 "uAmbientLightColor": { type: "c", value: new THREE.Color( 0x050505 ) },

//                 "uMaterialColor":  { type: "c", value: new THREE.Color( 0xffffff ) },
//                 "uSpecularColor":  { type: "c", value: new THREE.Color( 0xffffff ) },

//                 uKd: {
//                     type: "f",
//                     value: 0.7
//                 },
//                 uKs: {
//                     type: "f",
//                     value: 0.3
//                 },
//                 shininess: {
//                     type: "f",
//                     value: 100.0
//                 },
//                 uGroove: {
//                     type: "f",
//                     value: 1.0
//                 }
//             }
//         }

//     };

//     var shader = shaderTypes[id];

//     var u = THREE.UniformsUtils.clone(shader.uniforms);

//     // this line will load a shader that has an id of "vertex" from the .html file
//     var vs = loadShader("vertex");
//     // this line will load a shader that has an id of "fragment" from the .html file
//     var fs = loadShader("fragment");

//     var material = new THREE.ShaderMaterial({ uniforms: u, vertexShader: vs, fragmentShader: fs });

//     material.uniforms.uDirLightPos.value = light.position;
//     material.uniforms.uDirLightColor.value = light.color;

//     material.uniforms.uAmbientLightColor.value = ambientLight.color;

//     return material;

// }




//**************************************************************************
// User interaction                                                          //
//***************************************************************************//
function addInputHandler()
{
    var dom = renderer.domElement;
    dom.addEventListener('mouseup', onMouseUp, false);
    dom.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
}

function onKeyDown(evt)
{
    var keyCode = getKeyCode(evt);
    keyPressed[keyCode] = true;

    console.log(keyCode);

    if (keyCode == 32) {
        animating = !animating;        
    }
}

function onKeyUp(evt)
{
    var keyCode = getKeyCode(evt);

    keyPressed[keyCode] = false;
}

function onMouseDown(event)
{
    event.preventDefault();
}

function onMouseUp(event)
{
    event.preventDefault();
}

function onMouseMove(event)
{
    event.preventDefault();
    if (dragging) {
        var x = prevMouse.x - event.x;
        var y = prevMouse.y - event.y;
        camera.rotation.y -= x/1000;

        prevMouse.x = event.x;
        prevMouse.y = event.y;
    }
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function getKeyCode(evt)
{
    if (window.event != null) 
        return window.event.keyCode;
    else
        return evt.which;
}

function map(i, sStart, sEnd, tStart, tEnd)
{
    var v = i-sStart;
    if (v>=0) {
        if (i < sStart) {
            return tStart;
        } else if (i > sEnd) {
            return tEnd;
        }
    } else {
        if (i > sStart) {
            return tStart;
        } else if (i < sEnd){
            return tEnd;
        }
    }
    var sRange = sEnd - sStart;
    if (sRange == 0) {
        return tStart;
    }

    var tMax = tEnd - tStart;
    return tStart + v / sRange * tMax;
}

function getFuncVal(t)
{
    return new THREE.Vector3(
        Math.sin(t*Math.cos(t)),
        Math.cos(t*Math.sin(t)),
        Math.cos(t*Math.tan(t))
        );
}

function clip(x, bottom, top)
{
    if (!clip) {
        return x;
    }

    if (x < bottom) {
        x = bottom;
    }
    else if (x > top) {
        x = top;
    }

    return x;
}
            
        
    