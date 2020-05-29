//this JS builds the spike obstacles

//builds the cone or spike
let cone = function () {
    //texture to be use for the cones or spike
    let texture = new THREE.TextureLoader().load("../IMG/spike_texture.jpg");
    let geo = new THREE.ConeGeometry(0.3, 1, 32);
    let mat = new THREE.MeshBasicMaterial({map: texture});
    return new THREE.Mesh(geo, mat);
};

//the function puts two cones side by side to build a spike
let buildSpike = function () {
    let spike = new THREE.Object3D();
    let co = cone();
    co.position.x += 0.6;
    spike.add(co);

    co = cone();
    spike.add(co);
    return spike;
};

