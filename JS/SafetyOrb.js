//This class builds the safety orb
class SafetyOrb{
    constructor(x, y, z) {
        this.collidedWithCar = false;//boolean variable that stores the collision state
        //with the car
        this.sphereCam = new THREE.CubeCamera(1, 500, 100);
        this.sphereCam.position.set(x, y, z);
        scene.add(this.sphereCam);

        let sphereMat = new THREE.MeshBasicMaterial({
            envMap: this.sphereCam.renderTarget
        });
        let sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
        this.safetyOrb = new THREE.Mesh(sphereGeo, sphereMat);
        this.safetyOrb.position.set(x, y, z);
    }

    get getTheSafetyOrb(){
        return this.safetyOrb;
    }

    //update the the position of the safetyOrb sphere and the cubeCamera(sphereCam)
    updateSafetyOrb(z){
       this.safetyOrb.position.z += z;
       this.sphereCam.position.z += z;

       this.sphereCam.updateCubeMap(renderer, scene);
    }

    //removes the the sphere and the cube camera
    destroySafetyOrb(){
        scene.remove(this.safetyOrb);
        scene.remove(this.sphereCam);
    }

    //updates the collision state with car
    //this function gets called when car collides with the safety orb
    safetyOrbCollidedWithCar(){
        this.collidedWithCar = true;
    }

    get hasCollidedWithCar(){
        return this.collidedWithCar;
    }
}
