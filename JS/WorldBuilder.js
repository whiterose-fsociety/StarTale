//this JS contains all the code responsible for building the world, excluding the logic
//declare the global values

//camera is the camera used as the main view and renderer renders that view
//topCamera sits above the car, and the view is rendered by renderer2 and it sits at the lowerRight corner
//spotLight is the red Light that shines on the floor
let scene, camera, topCamera,renderer, renderer2, spotLight;
let pause = true; //pauses the game when true, used in update function

let ground;//reference to the ground that objects sit on
let musicPlaying = false;//stores the state of the background music

//this stores configurations for camera and spotLight
//this will be used to change the view when user presses c
let viewConfigTracker = 0; //tracks which view configuration is active
let viewConfigurations = [
    [
        [4, 4, 5],//camera position
        [-6, 17, -30]//spotlight position
    ],
    [
        [0, 2, 5],
        [0, 17, -30]
    ],
];

//adds frames per second tracker on the top left corner
function addFPSTracker() {
    //for debugging
    (function(){
        const script = document.createElement('script');
        script.onload=function(){
            const stats = new Stats();
            document.body.appendChild(stats.dom);
            requestAnimationFrame(function loop(){
                stats.update();
                requestAnimationFrame(loop)});
        };
        script.src='//mrdoob.github.io/stats.js/build/stats.min.js';
        document.head.appendChild(script);})();
}

function setUpWorld(){
    //create scene
    scene = new THREE.Scene();

    //create and add ambient light
    let light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );

    //add black fog
    scene.fog = new THREE.Fog(0x000000, 1, 30);

    //create camera that user will use to see the game through
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

    //create camera that will be used to view the game from the top
    //for game map
    topCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    topCamera.position.set(0, 10, -10);
    topCamera.rotation.x = -2;

    scene.add(topCamera);

    //get the default configurations
    let viewConfig = viewConfigurations[viewConfigTracker];
    let camConfig = viewConfig[0];
    //position camera
    camera.position.x = camConfig[0];
    camera.position.y = camConfig[1];
    camera.position.z = camConfig[2];

    //set a renderer to render the scene and enables antialias
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer2 = new THREE.WebGLRenderer({antialias: true});

    renderer.autoClear = false;
    renderer2.autoClear = false;

    //renderer will fill the screen
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer will fill a viewPort of 100px X 200px
    renderer2.setSize(100, 200);

    //allow shadows to be rendered
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //adds renderer canvas
    document.body.appendChild( renderer.domElement);

    //get the canvas for the maps
    let map = renderer2.domElement;
    //set a style to it
    //the style map is defined in index.html in the style tag
    //this allows the map to sit on the bottom right corner and
    //onTop of the whole game
    map.classList.add("map");
    document.body.appendChild( map );

    //listens for browser or window resize then resizes the whole game
    window.addEventListener('resize', function () {
        //set the size again
        renderer.setSize(window.innerWidth, window.innerHeight);
        //maintains the aspect ratio
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    //add a static skyBox to the scene
    let skyBoxGeo = new THREE.CubeGeometry(1000, 1000, 1000); // the dimensions have to be big since it's covering
    // the whole playable scene
    //load the materials for all the sides for the skBbox
    let skyBoxSideMaterials = [
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../IMG/back.png"), side: THREE.DoubleSide, fog: false}), //set fog to false so
        //that skyBox doesn't get affected by fog
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../IMG/front.png"), side: THREE.DoubleSide, fog: false}),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../IMG/up.png"), side: THREE.DoubleSide, fog: false}),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../IMG/bottom.png"), side: THREE.DoubleSide, fog: false}),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../IMG/right.png"), side: THREE.DoubleSide, fog: false}),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../IMG/left.png"), side: THREE.DoubleSide, fog: false})
    ];

    let skyBox = new THREE.Mesh(skyBoxGeo, skyBoxSideMaterials);
    scene.add(skyBox);

    //build the car
    let c = buildCar(); //build car function from Car.js
    console.log(c);
    c.scale.set(.005,.005,.005);
    c.position.set(0,0,0);
    c.rotation.y = -1.539;
    c.castShadow = true;//allows car to cast shadows
    scene.add(c);

    //set the camera to look @ the cars position
    camera.lookAt(c.position);

    //came from https://threejs.org/docs/#api/en/lights/SpotLight
    spotLight = new THREE.SpotLight( "blue"); //creates red spot light
    let spotLightConfig = viewConfig[1];

    spotLight.position.x = spotLightConfig[0];
    spotLight.position.y = spotLightConfig[1];
    spotLight.position.z = spotLightConfig[2];
    spotLight.castShadow = true;
    spotLight.angle = 1;

    spotLight.shadow.mapSize.width = 512;  // default
    spotLight.shadow.mapSize.height = 512; // default
    spotLight.shadow.camera.near = 0.5;       // default
    spotLight.shadow.camera.far = 500;

    spotLight.intensity = 15;
    spotLight.castShadow = true;

    spotLight.power = 10 * Math.PI;
    spotLight.intensity = 12;

    buildGround();

    scene.add( spotLight );

    initListenKeyListenPress();
}

//builds the actual ground where objects sit on top off
function buildGround(){
    //builds and positions the ground floor
    let geometry = new THREE.BoxGeometry(5, 0.1, 305);
    let material = new THREE.MeshPhongMaterial({color: 0x000000, wireframe: false});
    ground = new THREE.Mesh(geometry, material);
    ground.position.z -= 130;
    ground.position.y -= 0.5;
    ground.receiveShadow = true;
    scene.add(ground);
}

// //initialize backgroundMusic
// function initBackgroundMusic(){
//     musicPlaying = true;
//     let listener = new THREE.AudioListener();
//     camera.add( listener );
//
// // create a global audio source
//     let sound = new THREE.Audio( listener );
//
// // load a sound and set it as the Audio object's buffer
//     let audioLoader = new THREE.AudioLoader();
//     audioLoader.load( '../AUDIO/backgroundMusic.mp3', function( buffer ) {
//         sound.setBuffer( buffer );
//         sound.setLoop( true );
//         sound.setVolume( 0.5 );
//         sound.play();
//     });
// }

//draws the scene
let render = function () {
    renderer.clear();
    renderer.render( scene, camera );

    renderer2.clear();
    renderer2.render(scene, topCamera);
};

//listen for key press
function initListenKeyListenPress() {
    window.addEventListener('keydown', function (e) {
        if(e.key.toLowerCase() === 'p'){
            pause = !pause;
            if (pause) document.getElementById("pauseMenu").style.display = "block";
            else document.getElementById("pauseMenu").style.display = "none";
        }
        if(e.key.toLowerCase() === 'c'){
            changeViewConfig();
        }
        if(e.key.toLowerCase() === 'f'){
            goToFullScreen();
        }
    });
}

function goToFullScreen() {
    if (THREEx.FullScreen.available()) {
        if( THREEx.FullScreen.activated() ) THREEx.FullScreen.cancel();
        else THREEx.FullScreen.request();
    }
}

function changeViewConfig() {
    viewConfigTracker = viewConfigTracker === 0 ? 1 : 0;
    let viewConfig = viewConfigurations[viewConfigTracker];
    let camConfig = viewConfig[0];

    //position camera
    camera.position.x = camConfig[0];
    camera.position.y = camConfig[1];
    camera.position.z = camConfig[2];
    camera.lookAt(car.position);

    let spotLightConfig = viewConfig[1];
    spotLight.position.x = spotLightConfig[0];
    spotLight.position.y = spotLightConfig[1];
    spotLight.position.z = spotLightConfig[2];
}
