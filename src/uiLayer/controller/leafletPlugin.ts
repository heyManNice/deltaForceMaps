import eventBus from "@src/eventBus";
import L from "leaflet";
import measurer from '@src/measurer';

let gloablMap:L.Map|undefined = undefined;

const zoomInOut = {
    zoomIn(){
        if(!gloablMap){
            return;
        }
        gloablMap.zoomIn();
    },
    zoomOut(){
        if(!gloablMap){
            return;
        }
        gloablMap.zoomOut(); 
    },
    enalbe(){
        eventBus.on('UiLayerControl:zoomIn',zoomInOut.zoomIn)
        eventBus.on('UiLayerControl:zoomOut',zoomInOut.zoomOut) 
    },
    disable(){
        eventBus.off('UiLayerControl:zoomIn',zoomInOut.zoomIn)
        eventBus.off('UiLayerControl:zoomOut',zoomInOut.zoomOut)  
    }
}


const compass = {
    reset(event:CustomEvent){
        if(!gloablMap){
            return;
        }
        const r = event.detail;
        if(isNaN(r)){
            console.warn(`UiLayerControl:rotateReset event.detail '${r}' is not a number`);
            return;
        }
        gloablMap?.setBearing(r);
    },
    onRotate(){
        const bearing = gloablMap?.getBearing();
        if(!bearing){
            return;
        }
        eventBus.emit('UiLayerControl:rotate',bearing);
        eventBus.on('UiLayerControl:rotateReset',compass.reset);
    },
    enalbe(){
        if(!gloablMap){
            return; 
        }
        gloablMap.on('rotate',compass.onRotate);
    },
    disable(){
        if(!gloablMap){
            return;
        }
        gloablMap.off('rotate',compass.onRotate);
        eventBus.off('UiLayerControl:rotateReset',compass.reset);
    }
}




function enalbe(map:L.Map){
    gloablMap = map;
    zoomInOut.enalbe();
    compass.enalbe();
    measurer.enable(map);
}

function disable(){
    zoomInOut.disable();
    compass.disable();
    measurer.disable();
    gloablMap = undefined;
}

export default {
    enalbe,
    disable
}