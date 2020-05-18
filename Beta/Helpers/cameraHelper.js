// Helper Classes
function setScissorForElement(elem) {
    const canvas = renderer.domElement;
    const canvasRect = canvas.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();

    // compute a canvas relative rectangle
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left = Math.max(0, elemRect.left - canvasRect.left);
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top = Math.max(0, elemRect.top - canvasRect.top);

    const width = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);

    // setup the scissor to only render to that part of the canvas
    const positiveYUpBottom = canvasRect.height - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);

    // return the aspect
    return width / height;
}



function splitCamera(camera,visible,viewElem,color){
    const aspect = setScissorForElement(viewElem);

    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    cameraHelper.update();

    cameraHelper.visible = visible;

    scene.background.set(color);

    renderer.render(scene,camera);
}
