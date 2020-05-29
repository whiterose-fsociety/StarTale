//this js contains all the descriptions for all stages
//this js contains the plan of each stage, the stage is actually built in StageLogic

//tracks which stage we current at, 0 for first level
let currStage = 0;

//this function sets the main level to level 1
function setLevel1(){
    logic = level1;//logic is the array used used to build the stage
    //level1 contains the description of level1
    gameSpeed = level1Speed;//level1Speed is a float variable that defines the game speed of level 1
}

//similar to above
function setLevel2() {
    logic = level2;
    gameSpeed = level2Speed;
}

//similar to above
function setLevel3() {
    logic = level3;
    gameSpeed = level3Speed;
}

//start the game at level1
function startAtLevel1(){
    currStage = 0;//set the current stage to level1
    clearStage();//remove all the objects in the game like obstacles, coins, safetyOrb, end gates
    setLevel1();//set the main level to level1
    buildStageLogic();//build level1 stage
    pause = false;//start the game
    let menus = document.getElementsByClassName("overlay");//get a list of all game menus
    for (let i = 0; i < menus.length; i++) menus[i].style.display = "none";//switch of the game menus

    if (!musicPlaying) initBackgroundMusic(); //in case if the background music is not playing, play it
}

//same as above
function startAtLevel2(){
    currStage = 1;
    clearStage();
    setLevel2();
    buildStageLogic();
    pause = false;
    let menus = document.getElementsByClassName("overlay");
    for (let i = 0; i < menus.length; i++) menus[i].style.display = "none";

    if (!musicPlaying) initBackgroundMusic();
}

//same as above
function startAtLevel3(){
    currStage = 2;
    clearStage();
    setLevel3();
    buildStageLogic();
    pause = false;
    let menus = document.getElementsByClassName("overlay");
    for (let i = 0; i < menus.length; i++) menus[i].style.display = "none";

    if (!musicPlaying) initBackgroundMusic();
}

//moves game to the next level when user clicks next level
function goToNextLevel(){
    currStage++;
    if (currStage === 1) startAtLevel2();
    else startAtLevel3();
}
//description for level1
//the approach used here is index face set to describe the stage
//with each sub array, defines what is going to be on the ground,
//each subarray covers 4.5 distance in the z-axis
//subarray contains three slots[right, middle, left]
//the possible values that can be in the subarray
//0 -> empty space
//1 -> there's a spike
//2 -> there's a coin
//3 -> there's a short cube
//4 -> there's a long cube
//5 -> there's an end gate
//6 -> there's a dangerCube
//9 -> there's a safetyOrb
let level1Speed = 0.1;
let level1 = [
    [0, 0, 0],
    [2, 1, 0],
    [0, 2, 1],
    [0, 0, 2],
    [0, 0, 1],
    [1, 0, 6],
    [0, 1, 2],
    [0, 2, 1],
    [0, 0, 1],
    [0, 1, 0],
    [0, 9, 2],
    [0, 1, 0],
    [6, 0, 2],
    [0, 1, 0],
    [0, 2, 2],
    [0, 0, 1],
    [1, 0, 0],
    [2, 1, 0],
    [0, 0, 1],
    [0, 2, 1],
    [0, 1, 0],
    [2, 0, 0],
    [0, 1, 0],
    [0, 2, 1],
    [0, 0, 0],
    [0, 2, 1],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0, 2, 1],
    [0, 1, 0],
    [0, 0, 0],
    [0, 1, 2],
    [0, 0, 1],
    [0, 2, 0],
    [0, 0, 1],
    [1, 0, 0],
    [2, 1, 0],
    [0, 0, 1],
    [0, 0, 1],
    [2, 1, 0],
    [0, 0, 0],
    [0, 1, 2],
    [0, 2, 0],
    [0, 1, 0],
    [6, 0, 0],
    [0, 0, 1],
    [1, 0, 0],
    [0, 1, 0],
    [0, 2, 1],
    [0, 0, 1],
    [2, 1, 0],
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0, 0, 0],
    [2, 0, 1],
    [1, 0, 2],
    [0, 1, 0],
    [0, 2, 1],
    [0, 0, 1],
    [5, 5, 5]
];

//desc for level2
let level2Speed = 0.15;
let level2 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 3],
    [0, 2, 0],
    [0, 3, 4],
    [3, 0, 0],
    [0, 0, 0],
    [0, 3, 2],
    [0, 2, 3],
    [0, 0, 3],
    [0, 9, 2],
    [3, 0, 2],
    [0, 1, 0],
    [1, 0, 1],
    [0, 0, 3],
    [0, 2, 0],
    [0, 2, 0],
    [0, 1, 1],
    [3, 0, 0],
    [0, 6, 2],
    [0, 2, 0],
    [4, 2, 4],
    [4, 2, 4],
    [0, 2, 0],
    [0, 2, 6],
    [3, 0, 3],
    [0, 1, 0],
    [0, 2, 4],
    [3, 2, 0],
    [0, 2, 2],
    [0, 2, 1],
    [0, 4, 2],
    [0, 0, 2],
    [0, 2, 0],
    [2, 0, 0],
    [2, 0, 0],
    [0, 1, 2],
    [0, 0, 2],
    [0, 0, 0],
    [0, 3, 0],
    [3, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [6, 0, 4],
    [1, 0, 0],
    [0, 0, 0],
    [0, 2, 0],
    [0, 2, 0],
    [1, 2, 0],
    [0, 0, 1],
    [0, 1, 0],
    [0, 0, 4],
    [4, 1, 0],
    [4, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
    [0, 0, 2],
    [0, 0, 2],
    [0, 3, 0],
    [4, 0, 4],
    [0, 0, 0],
    [5, 5, 5]
];

//desc for level3
let level3Speed = 0.2;
let level3 = [
    [0, 0, 0],
    [2, 0, 0],//1 indicates there's a spike
    [0, 2, 0],//2 indicates there's a coin
    [6, 0, 2],
    [0, 0, 0],
    [0, 0, 6],
    [0, 0, 2],
    [0, 2, 0],
    [0, 0, 0],
    [6, 6, 6],
    [0, 9, 2],//9 inidcates there's a safety orb
    [0, 0, 0],
    [0, 0, 2],
    [0, 0, 0],
    [6, 2, 2],
    [0, 0, 1],
    [0, 0, 0],
    [2, 1, 0],
    [0, 0, 1],
    [0, 2, 1],
    [0, 3, 0],
    [2, 0, 0],
    [0, 1, 0],
    [0, 2, 1],
    [0, 0, 0],
    [0, 2, 1],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0, 2, 1],
    [0, 1, 0],
    [3, 0, 0],
    [3, 1, 2],
    [0, 6, 1],
    [4, 2, 0],
    [0, 0, 1],
    [1, 0, 0],
    [2, 1, 0],
    [3, 6, 1],
    [0, 3, 1],
    [2, 1, 0],
    [0, 0, 0],
    [0, 1, 2],
    [0, 2, 0],
    [0, 1, 0],
    [4, 0, 0],
    [0, 4, 1],
    [1, 0, 0],
    [0, 1, 0],
    [0, 2, 1],
    [0, 0, 1],
    [2, 1, 0],
    [0, 0, 0],
    [0, 1, 0],
    [3, 0, 1],
    [3, 0, 0],
    [2, 6, 1],
    [1, 0, 2],
    [0, 1, 0],
    [0, 2, 1],
    [0, 0, 1],
    [5, 5, 5] //5 indicates end gate
];
