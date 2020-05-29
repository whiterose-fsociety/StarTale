//logic is the current level description
let logic = level1;
let gameSpeed = level1Speed; //current game speed
let totalCoinsInScene, totalCoinsCollected; //used for stats, that appears in the top right corner

let stageObjects = [];//saves the objects inside the scene

//declare raycaster and mouse Variable
//found at https://threejs.org/docs/#api/en/core/Raycaster
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();//stores the position of the mouse

//this function is called each time the mouse moves
//and updates the mouse x and y coordinates
function onMouseMove(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

//listen for mouse move
window.addEventListener( 'mousemove', onMouseMove, false );

//builds the actual stage the user sees
//obstacles, coins, gates, safetyOrb all created and added to the scene here
function buildStageLogic() {
    totalCoinsInScene = 0;//reset back to default
    totalCoinsCollected = 0;//reset back to default
    let startZ = -5;//declare the Z position where obstacles can start being added

    for(let i = 0; i < logic.length; i++){//iterate through the index face set
        let item = logic[i];//get the face at position i

        for (let k = 0; k < item.length; k++){
            //pos 0 - right side
            //pos 1 - middle
            //pos 2 - left side
            if(item[k] !== 0){
                switch (item[k]) {
                    case 1://spike
                        //build spike
                        //position spike
                        //add the object to scene
                        //add the object to the stageObjects
                        let co = buildSpike();
                        co.name = "obstacle";//give the object a name
                        //this helps when checking for collisions
                        //every time we detect a collision
                        //we need to know what we collided with and
                        //act accordingly
                        co.position.z = startZ;
                        co.position.x = k === 0 ? 1.4 : k === 1 ? 0 : -1.4;
                        scene.add(co);
                        stageObjects.push(co);

                        break;

                    case 2://coin
                        totalCoinsInScene++;//count the coin added in scene
                        //do the similar to spike
                        let coin = buildCoin();
                        coin.name = "coin";
                        coin.position.z = startZ;
                        coin.position.x = k === 0 ? 1.4 : k === 1 ? 0 : -1.4;
                        scene.add(coin);
                        stageObjects.push(coin);
                        break;

                    case 9://safety orb
                        //similar approach as above
                        let safetyOrb = new SafetyOrb(k === 0 ? 1.4 : k === 1 ? 0 : -1.4, 0, startZ);
                        safetyOrb.name = "safetyOrb";
                        scene.add(safetyOrb.getTheSafetyOrb);
                        stageObjects.push(safetyOrb);
                        break;

                    case 3:
                        //similar approach as above
                        let shortCube = buildCubeObstacleShort();
                        shortCube.name = "obstacle";
                        shortCube.position.z = startZ;
                        shortCube.position.x = k === 0 ? 1.4 : k === 1 ? 0 : -1.4;
                        scene.add(shortCube);
                        stageObjects.push(shortCube);
                        break;

                    case 4:
                        //similar approach as above
                        let longCube = buildCubeObstacleLong();
                        longCube.name = "obstacle";
                        longCube.position.z = startZ;
                        longCube.position.x = k === 0 ? 1.4 : k === 1 ? 0 : -1.4;
                        scene.add(longCube);
                        stageObjects.push(longCube);
                        break;

                    case 6:
                        //similar approach as above
                        let dangerCube = buildDangerCube();
                        dangerCube.name = "dangerCube";
                        dangerCube.position.z = startZ;
                        dangerCube.position.x = k === 0 ? 1.4 : k === 1 ? 0 : -1.4;
                        scene.add(dangerCube);
                        stageObjects.push(dangerCube);
                        break;

                    case 5://end wall
                        //similar approach as above
                        const geo = new THREE.PlaneGeometry(1, 1);
                        //uses a Refractor object
                        //to make Refraction of light possible
                        let wall = new THREE.Refractor( geo, {
                            color: 0x999999,
                            textureWidth: 1024,
                            textureHeight: 1024,
                            shader: THREE.WaterRefractionShader//add a shadder
                        } );
                        wall.scale.x = 1.7;
                        wall.scale.y = 9;
                        wall.position.y += 0.25;
                        wall.position.x = k === 0 ? 1.4 : k === 1 ? 0 : -1.4;
                        wall.position.z = startZ;
                        wall.name = "wall";
                        stageObjects.push(wall);
                        scene.add(wall);

                        break;
                }
            }
        }
        //after building for the current Z value, move forward into the page
        startZ -= 4.5;
    }
}

//this function updates the obstacles
//in the game, the car is not actually moving forward
//the car is stable and the obstacles are actually moving towards the car
//the function moves each obstacle forward in the z-position(out of the page)
function updateWorld() {
    //iterate through all the objects stored in the StageObject
    //then move them forward in the z-axis
    for (let i = 0; i < stageObjects.length; i++){
        let object = stageObjects[i];
        if(object == null) continue;//this happens because
        //there's a possibility that the object can get deleted
        //from the list, e.g. coins when they get collected

        let currentObj = object;

        //check if it's the safetyOrb
        //because we don't store the object
        //itself, but the whole class, since safetyOrb
        //is a class
        if (currentObj.name === "safetyOrb") currentObj = currentObj.getTheSafetyOrb;//get the actual orb

        //if the car has already passed the object, and there's a distance of 10 between
        //then best to skip the object, because it's no longer in the scene
        //no need to update it's position
        //this saves us some some time
        if (car.position.z < currentObj.position.z && currentObj.position.z - car.position.z >= 10) continue;

        //if the object is the safetyOrb
        //call the function from the safetyOrb
        //to update the sphere and camera inside
        //the safetyOrb class
        if (object.name === "safetyOrb") object.updateSafetyOrb(gameSpeed);
        else stageObjects[i].position.z += gameSpeed;
    }

    //update the stats in case they changed
    //maybe the car collided with coin
    updateStats(totalCoinsCollected, totalCoinsInScene,
        //to get the distance to the end, we need to know the z value of the last object
        //in the scene, since the car is on position 0, the z value gives an accurate distance
        //we take the absolute value because the object is in the negative z-axis
        //then round the value
        Math.round(Math.abs(stageObjects[stageObjects.length - 1].position.z))
    );

    //This function is responsible for mouse
    //controls, when the mouse moves over the dangerCube
    //it disables it
    shootRayAndCheckForHits();
}

function shootRayAndCheckForHits() {
    raycaster.setFromCamera(mouse, camera);//shoots a ray from the mouse into the scene
    //get a list of all the objects the ray that the ray intersected with
    let intersects = raycaster.intersectObjects(scene.children);
    for(let i = 0; i < intersects.length; i++){//iterate through the objects
        //we only care about the dangerCube
        let hitObject = intersects[i].object;
        if(hitObject.name === "dangerCube"){//danger cube hit
            hitObject.material.color.set(0x000000);//change the color of the danger cube to black
            //gives the idea that it's deactivated
            //after the cube is deactivated, it becomes an obstacle
            hitObject.name = "obstacle";
            //play deactivated sound
            document.getElementById("dangerCubeDisabled").play();
            break;
        }
    }
}

//removes all objects from the scene
function clearStage() {
    while (stageObjects.length > 0){
        let object = stageObjects[0];
        if(object == null){
            stageObjects.shift();//remove the first element in the array
            continue;
        }
        if (object.name === "safetyOrb") object.destroySafetyOrb();
        else scene.remove(stageObjects[0]);
        stageObjects.shift();
    }
    safetyOrbCollected = false;//reset the safetyOrbCollected stated
}

function restartGame() {
    clearStage();//remove all objects
    buildStageLogic();//then rebuild

    let menus = document.getElementsByClassName("overlay");//get all menu
    for (let i = 0; i < menus.length; i++) menus[i].style.display = "none";//and switch them off
    pause = false;
}

// found here: http://www.bryanjones.us/article/basic-threejs-game-tutorial-part-5-collision-detection
let carShrinkVector = new THREE.Vector3(-0.1, -0.1, -0.1);//used to decrease the collision box around the car
let shrinkVector = new THREE.Vector3(-0.1, -0.1, -0.1);//used to decrease the collision box around the object
//main thing is to have collision that ain't too sensitive

//this function is called each frame
//covers the car current position with a box
//then iterates all the objects in the scene
//then cover each object with a box
//then checks for collision
function detectCollisions() {

    // Run through each object and detect if there is a collision.
    for ( let index = 0; index < stageObjects.length; index ++ ) {

        let currentObj = stageObjects[index];

        if(currentObj == null) continue;//this is a possibilty because it's possible a coin was in the list
        //then it got removed

        if (currentObj.name === "dangerCube"){
            //increase the x and y of the dangerCube, to prevent player from jumping over it
            //or passing it by moving to the side
            shrinkVector.x = 10;
            shrinkVector.y  = 10;
        }
        else{
            //since it's global, we have to reset it
            shrinkVector.x = -0.1;
            shrinkVector.y = -0.1;
        }
        //when we reach the safety orb, we retrieve the object itself
        if (currentObj.name === "safetyOrb") currentObj = currentObj.getTheSafetyOrb;


        //if car has already passed the object, no need to check for collisions
        if (car.position.z < currentObj.position.z && currentObj.position.z - car.position.z >= 1) continue;

        //cover the car with the box used for collisions
        let carBoxCollider = new THREE.Box3().setFromObject(car);
        //shrink the box
        carBoxCollider.expandByVector(carShrinkVector);

        //get the bounds of the box, used to check for collisions
        let carBoxColliderBounds = {
            xMin: carBoxCollider.min.x,
            xMax: carBoxCollider.max.x,
            yMin: carBoxCollider.min.y,
            yMax: carBoxCollider.max.y,
            zMin: carBoxCollider.min.z,
            zMax: carBoxCollider.max.z,
        };

        //do the same thing with object, cover it with an object
        let boxCollider = new THREE.Box3().setFromObject(currentObj);
        //shrink the box
        boxCollider.expandByVector(shrinkVector);

        //get the bounds of the box, used to check for collisions
        let bounds = {
            xMin: boxCollider.min.x,
            xMax: boxCollider.max.x,
            yMin: boxCollider.min.y,
            yMax: boxCollider.max.y,
            zMin: boxCollider.min.z,
            zMax: boxCollider.max.z,
        };

        //check for overlap
        if ( ( carBoxColliderBounds.xMin <= bounds.xMax && carBoxColliderBounds.xMax >= bounds.xMin ) &&
            ( carBoxColliderBounds.yMin <= bounds.yMax && carBoxColliderBounds.yMax >= bounds.yMin) &&
            ( carBoxColliderBounds.zMin <= bounds.zMax && carBoxColliderBounds.zMax >= bounds.zMin) ) {
            // We hit something
            if(stageObjects[index].name === "coin"){//if we hit the coin
                //remove it from the scene
                scene.remove(stageObjects[index]);
                //play the coin sound
                coinCollectedAlert();
                //delete the coin from array
                delete stageObjects[index];
                //update the coin count
                totalCoinsCollected++;
            }
            else if (stageObjects[index].name === "wall"){//if we hit the end wall
                //alert level complete
                LevelWon();
                pause = true;
            }
            else if (stageObjects[index].name === "obstacle" || stageObjects[index].name === "dangerCube"){
                carDied();
                pause = true;
            }
            //if we collided with the safetyOrb and we haven't done it before(&& !stageObjects[index].hasCollidedWithCar)
            else if (stageObjects[index].name === "safetyOrb" && !stageObjects[index].hasCollidedWithCar){
                //then alert we found the safety orb
                foundSafetyOrb();
                //update the safetyOrb that it has collided with the car
                stageObjects[index].safetyOrbCollidedWithCar();
            }
        }
    }
}
