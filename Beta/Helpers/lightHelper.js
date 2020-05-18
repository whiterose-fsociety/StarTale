
class ColorGUIHelper{
    constructor(object,prop) {
        this.object = object;
        this.prop = prop;
    }
    get value(){
        return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString){
        this.object[this.prop].set(hexString);
    }
}


function makeXYZGUI(gui,vector3,name,onChangeFn){
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
}
class DegRadHelper {
    constructor(obj, prop) {
        this.obj = obj;
        this.prop = prop;
    }
    get value() {
        return THREE.MathUtils.radToDeg(this.obj[this.prop]);
    }
    set value(v) {
        this.obj[this.prop] = THREE.MathUtils.degToRad(v);
    }
}
