import eventBus from "@src/eventBus";
import L from "leaflet";

let gloablMap:L.Map|undefined = undefined;

function zoomIn(){
    if(!gloablMap){
        return;
    }
    gloablMap.zoomIn();
}
function zoomOut(){
    if(!gloablMap){
        return;
    }
    gloablMap.zoomOut(); 
}

function enalbe(map:L.Map){
    gloablMap = map;
    eventBus.on('UiLayerControl:zoomIn',zoomIn)
    eventBus.on('UiLayerControl:zoomOut',zoomOut)
}

function disable(){
    
    gloablMap = undefined;
}

export default {
    enalbe,
    disable
}