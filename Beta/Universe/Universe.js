class Universe{



}
function animateStars() {
    for(var i=0; i<stars.length; i++) {
        star = stars[i];
        star.position.x +=  i/10;
        if(star.position.x>1000) star.position.x-=2000;

    }

}
function addSphere(scene){
    for ( var z= -1000; z < 1000; z+=10 ) {

        var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
        var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        var sphere = new THREE.Mesh(geometry, material)

        sphere.position.x = Math.random() * 1000 - 500;
        sphere.position.y = Math.random() * 1000 - 500;

        sphere.position.z = z;
        sphere.scale.x = sphere.scale.y = 2;

        scene.add( sphere );
        stars.push(sphere);
    }
}