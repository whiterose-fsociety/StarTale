//buid a 3D object that will hold other objects
//declaring it global because it will be used to move the whole car
//when keyboard or mouse pressed
let car = new THREE.Object3D();

//keeps track of frame count
//used to give car that bouncy effect
//used in animate car function
let frameCount = 0;

//declaring a bool to track if the safety orb was collected
let safetyOrbCollected = false;

//below are variables for making the car jump
//tracks the cars jumps state
//followed this video
// https://www.youtube.com/watch?v=c4b9lCfSDQM
let carJumpActive = false;
let carPreviousY = 0;
let velocity = new THREE.Vector3(0, 3 , 0);
let gravity = new THREE.Vector3(0, -2, 0);
let prevTime = 0;
let currTime = performance.now();

//dictionary that stores the key pressed
let keyPressedTracker = {};

//renders the top part of the car
let carTop = function () {
    let top = new THREE.Mesh(
        new THREE.BoxGeometry(1.7, 0.5, 1.5),//1.7, ... are the dimensions of the geometry
        new THREE.MeshPhongMaterial({//reason for PhongMaterial is that it can be affected by the spotLight
            color: 0x000000//set the color to black
        })
    );
    //the code below builds the white lines that appear on the cars edges
    let geo = new THREE.EdgesGeometry(top.geometry);//builds the edge geometry for the top(Mesh object above)
    let mat = new THREE.LineBasicMaterial({color: 0xffffff, line: 2});//builds the material for the geometry and gives it the color white
    let wf = new THREE.LineSegments(geo, mat);//builds the actual line segments
    top.castShadow = true;//allow the top part to cast shadows when hit by light(in this game, spotlight)
    top.add(wf);//adds the line segment to the top part of the car
    return top;//returns the top par
};

//renders a box geometry that will act as the back light
//approach is the same as carTop
let backLight = function(){
    let backLight = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.2, 0.2),
        new THREE.MeshBasicMaterial({color: 0xce0a0a})
    );

    let geo = new THREE.EdgesGeometry(backLight.geometry);
    let mat = new THREE.LineBasicMaterial({color: 0xffffff, line: 2});
    let wf = new THREE.LineSegments(geo, mat);
    backLight.add(wf);
    return backLight;
};

//renders a cylinder geometry that will act as the front light
//approach similar to backLight
let frontLight = function(){
    return new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 1, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
};

//renders a box geometry that will act as the cars bottom
//approach is the same as carTop
let carBottom = function () {
    let bottom =  new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.7, 2.5),
        new THREE.MeshPhongMaterial({
            color: 0x000000
        })
    );

    let geo = new THREE.EdgesGeometry(bottom.geometry);
    let mat = new THREE.LineBasicMaterial({color: 0xffffff, line: 2});
    let wf = new THREE.LineSegments(geo, mat);
    bottom.castShadow = true;
    bottom.add(wf);
    return bottom;
};

var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
};

//builds the whole car
let buildCar = function () {
    //builds the top part of the car


    // Create the cabin
    var geomCockpit = new THREE.BoxGeometry(60,50,50,1,1,1);
    var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    car.add(cockpit);

    // Create the engine
    var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
    var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
    var engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    car.add(engine);

    // Create the tail
    var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
    var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-35,25,0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    car.add(tailPlane);

    // Create the wing
    var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
    var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    car.add(sideWing);

    // propeller
    var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
    var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    // blades
    var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
    var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});

    var blade = new THREE.Mesh(geomBlade, matBlade);
    blade.position.set(8,0,0);
    blade.castShadow = true;
    blade.receiveShadow = true;
    this.propeller.add(blade);
    this.propeller.position.set(50,0,0);
    car.add(this.propeller);
    setKeyboardControls();
    return car;


    //sets up the keyboard controls

}

//The code below is responsible for keyboard controls
function setKeyboardControls(){
    //the function detects key press down (when user presses a key)
    window.addEventListener('keydown', function (e) {
        e.preventDefault();//prevents scrolling if the webpage has scrollbars, especially when using arrow keys
        //saving only the key that was pressed, car will be moved in another
        //function to avoid translation delays
        keyPressedTracker[e.key.toLowerCase()] = true;//converting to lower case in case if a players
        // keyboard has caps lock
    }, true);

    //the function detects key up event (when user lifts his/her finger from a key)
    window.addEventListener('keyup', function (e) {
        e.preventDefault();
        keyPressedTracker[e.key.toLowerCase()] = false;
    }, true);
}

//this function will be called in the update function
function moveCarIfKeyPressed() {
    if(keyPressedTracker["a"] || keyPressedTracker["arrowleft"]){
        if(car.position.x >= -1.3) car.position.x -= 0.1;//moves the car to the left
    }

    else if(keyPressedTracker["d"] || keyPressedTracker["arrowright"]){
        if(car.position.x <= 1.3) car.position.x += 0.1;//moves the car to the right
    }

    else if(keyPressedTracker[" "] || keyPressedTracker["arrowup"] || keyPressedTracker["w"]){
        if(!carJumpActive){//checks if the car was not already in the air
            document.getElementById("jumpSound").play();//plays the jump sound when the car lifts off
        }
        carJumpActive = true;//car jump active
    }

    if(carJumpActive){//if the car is active, apply the physics
        //learnt from this video: https://www.youtube.com/watch?v=c4b9lCfSDQM
        let DELTA = currTime - prevTime;
        if(DELTA > 0.1) DELTA = 0.1;
        carPreviousY = car.position.y;
        car.position.y += velocity.y * DELTA;
        velocity.y += gravity.y * DELTA;
    }
}

//this function sets the values used for jump back to their default values
function resetJumpValues() {
    gravity = new THREE.Vector3(0, -2, 0);
    velocity = new THREE.Vector3(0, 3, 0);
    carJumpActive = false;
    carPreviousY = 0;
}

//this function checks if the car is on the ground
function carIsOnTheGround() {
    return car.position.y <= -0.2; //long as car is below -0.2, then it's on the ground
    //reason for this is to avoid confusions of the function since the car will be bouncing
}

//this function is responsible for that cool bouncing effect
//that happens on the car, to make the bounce effect, we used
//a sine graph and scaled it down, to make sure that the bounce effect
//is not too fast, and the displacement is not too high
function animateCar() {
    if (carJumpActive) return;//if the car is in a jumping state, no need to make the bounce animation
    //the 0.2 is to make sure that the highest point the y value of the car can reach is 0.2 and lowest is -0.2
    //but for the car to be on the ground, the y value must be <= -0.2, to fix this
    //we subtract by 0.4
    car.position.y = (0.2 * Math.sin((Math.PI / 6) * (frameCount/5) //dividing frameCount by a num to slow down the animation
    ) - 0.4)/
        2.5;//dividing by num to decrease the height of the car bounce
    frameCount++;
}

//the function gets called when the car collides with an obstacle
function carDied() {
    // let audio = new Audio("../AUDIO/car_explosion.mp3");//load the car explosion sound from the AUDIO folder
    // audio.play().then(r => {});//play the sound
    setTimeout(function () {
        //wait for 1 second then display the GameOverMenu
        document.getElementById("GameOverMenu").style.display = "block";//this gets a reference to the gameOverMenu
        //in the index.html and displays
    }, 1000);
}

//this function plays a sound when the car collects a coin
function coinCollectedAlert() {
    let audio = new Audio("../AUDIO/coin.mp3");
    audio.volume = 0.2;
    audio.play().then(r => {});
}

//inorder for a player to win, the player must collect the safetyOrb
//then reach the end of the level
//gets called in StageLogic.js
function LevelWon() {
    if (safetyOrbCollected || totalCoinsCollected ==16){//checks if the player collected the safety orb
        document.getElementById("levelComplete").play();
        if (currStage === 2) {
          document.getElementById("gameComplete").style.display = "block";
          console.log(names);
          writeName();
          fadeInText();
          scrollText();



      }//if the player was
            //on the last stage, display the gameCompleteMenu
        else {
          goToNextLevel();
          // document.getElementById("levelWon").style.display = "block";

        }//else display the normal level complete menu
    }
    else{//player reached the end but failed to collect the safety orb
        let audio = new Audio("../AUDIO/lose.mp3");
        audio.play().then(r => {});//plays the lose audio
        document.getElementById("levelWonBut").style.display = "block";//display the level won but lost div
    }
}
//gets called in StageLogic.js when car collides with the safety orb
function foundSafetyOrb() {
    safetyOrbCollected = true;
    let audio = new Audio("../AUDIO/safetyOrbFound.mp3");
    audio.play().then(r => {});
}
