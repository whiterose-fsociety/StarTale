//builds the coin sphere
function buildCoin() {
    let coinGeo = new THREE.SphereGeometry(0.3, 32, 32);
    let coinMat = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        flatShading: true,//enable flat shading which gives the circle the rubbery feel
    });
    let coin = new THREE.Mesh(coinGeo, coinMat);
    coin.castShadow = true;
    coin.position.set(0, 0, 0);

    return coin;
}
