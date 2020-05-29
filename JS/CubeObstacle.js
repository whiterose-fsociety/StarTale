//this code builds the cube obstacles that appear the game

//there are 3 kinds of cubes
//short cube all sides are equal
//long cube, longer on the z-axis
//danger cube, pink in color, it casts an invincible shield
//it gets deactivated by hovering the mouse of cube, this is done in
//StageLogicBuilder.js

//declare environment map, this builds a cube like plan made of images
//that define the back(backward), front, up(forward), bottom, right, left
//this texture map will be applied to cube short and long to give the objects that have
//that reflective feel
let reflection = THREE.ImageUtils.loadTextureCube( [ '../IMG/back.png',
    '../IMG/front.png',
    '../IMG/up.png',
    '../IMG/bottom.png',
    '../IMG/right.png',
    '../IMG/left.png' ] );

//declare the material for the short and long cube
//https://threejs.org/docs/#api/en/materials/MeshLambertMaterial
let cubeMaterial = new THREE.MeshLambertMaterial(
    {
        color: 0xaf8523,
        envMap: reflection,//apply the reflection map onto the material, this makes it possible
        //for the material
        emissive: 0xcc9d6,
    }
);

//declare the geometry of the cubeObstacle
let defaultCubeGeo = new THREE.BoxGeometry(1, 1, 1);
let longCubeGeo = new THREE.BoxGeometry(1, 1, 3);

//declare the cubes and set to null, will be initialised in function
let cubeShort = null, cubeLong = null;

//main reason for declaring most stuff global is to optimize performance
//we only create objects once, then from there make a copy of them
//with buildDangerCube, the material is created every time the function gets called
//because the material is manipulated in stageLogicBuilder

//this function builds a short cube obstacle
function buildCubeObstacleShort(){
    //if the cube obstacle hasn't been declared before, create a Mesh object and initialise it to
    //cubeShort then return the object
    if (cubeShort == null) return ( cubeShort = new THREE.Mesh(defaultCubeGeo, cubeMaterial));
    else return cubeShort.clone();//if it has already been created, return a copy of the already created cube
    //this helps increase performance since cloning an object doesn't consume time
}

//same approach as buildCuberObstacleShort
function buildCubeObstacleLong() {
    if(cubeLong == null) return ( cubeLong = new THREE.Mesh(longCubeGeo, cubeMaterial));
    else return cubeLong.clone();
}

//same as the functions above, difference is we create a material for each Mesh object, and not make a copy of the already
//created Mesh
function buildDangerCube() {
    let dangerCubeMaterial = new THREE.MeshBasicMaterial(
        {color: 0xef12db}
    );
    return new THREE.Mesh(defaultCubeGeo, dangerCubeMaterial);
}


