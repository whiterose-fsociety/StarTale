
//Debug Switches

function switchCameraGUI(bool) {
    if(bool) {
        const gui = new dat.gui.GUI();
        gui.add(camera, 'fov', 0.1, 180).onChange(updateCamera);

        const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
        gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
        gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name("far").onChange(updateCamera);
    }
}

function switchAmbientGUI(bool,light){
    if(bool) {
        const gui = new dat.gui.GUI();
        gui.addColor(new ColorGUIHelper(light, "color"), 'value').name("color");
        gui.add(light, 'intensity', 0, 2, 0.01);
    }
}

function switchDirectionalGUI(bool,light){
    if(bool) {
        const gui = new dat.gui.GUI();
        gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
        gui.add(light, 'intensity', 0, 2, 0.01);
        makeXYZGUI(gui, light.position, 'position', updateLight);
        makeXYZGUI(gui, light.target.position, 'target', updateLight);
    }
}

function switchSpotLightGUI(bool,light){
    const gui = new dat.gui.GUI();
    gui.addColor(new ColorGUIHelper(light,'color'),'value').name('color');
    gui.add(light,'intensity',0,2,0.01);
    gui.add(light,'distance',0,40).onChange(updateLight);


    gui.add(new DegRadHelper(light,'angle'),'value',0,90).onChange(updateLight);
    gui.add(light,'penumbra',0,1,0.01);

    makeXYZGUI(gui,light.position,'position',updateLight);
    makeXYZGUI(gui,light.target.position,'target',updateLight);

}
