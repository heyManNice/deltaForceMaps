import eventBus from "@src/eventBus";
import L from "leaflet";
import measurer from '@src/measurer';
import {Layer} from '@src/uiLayer/layerSelector'

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

const hidenLayerGroup:L.LayerGroup[] = [];
const layerSelector = {
    getNewLayersData(){
        if(!gloablMap){
            return;
        }
        const data:Layer[] = [];

        //获取已显示的组
        gloablMap.eachLayer(function (layer) {
            if (layer instanceof L.LayerGroup) {
                data.push({
                    isShow: true,
                    name: layer.options.pane!,
                });
            }
        });
        //获取已隐藏的组
        for(const layer of hidenLayerGroup){
            data.push({
                isShow: false,
                name: layer.options.pane!,
            })
        }

        eventBus.emit("layerSelector:layerOnload",data);
    },
    confirm(event:CustomEvent){
        if(!gloablMap){
            return;
        };
        const data:Layer[] = event.detail;

        const shows = data.filter((layer)=>layer.isShow);
        const hidens = data.filter((layer)=>!layer.isShow);
        
    
        //即将显示
        const toRemove = [];
        for(const layer of hidenLayerGroup){
            const name = layer.options.pane!;
            if (shows.find((layer)=>layer.name === name)) {
                gloablMap!.addLayer(layer);
                toRemove.push(layer);
            }
        }
        for(const layer of toRemove){
            const index = hidenLayerGroup.indexOf(layer);
            if (index > -1) {
                hidenLayerGroup.splice(index, 1);
            }
        }

        //即将隐藏
        gloablMap.eachLayer(function (layer) {
            if (layer instanceof L.LayerGroup) {
                const name = layer.options.pane!;
                if (hidens.find((layer)=>layer.name === name)) {
                    gloablMap!.removeLayer(layer);
                    hidenLayerGroup.push(layer);
                }
            }
        });
    },
    enalbe(){
        eventBus.on("layerSelector:getNewLayersData",layerSelector.getNewLayersData)
        eventBus.on("layerSelector:confirm",layerSelector.confirm)
    },
    disable(){
        eventBus.off("layerSelector:getNewLayersData",layerSelector.getNewLayersData)
        eventBus.off("layerSelector:confirm",layerSelector.confirm)
    }
}

function enalbe(map:L.Map){
    gloablMap = map;
    zoomInOut.enalbe();
    compass.enalbe();
    measurer.enable(map);
    layerSelector.enalbe();
}

function disable(){
    zoomInOut.disable();
    compass.disable();
    measurer.disable();
    layerSelector.disable();
    gloablMap = undefined;
}

export default {
    enalbe,
    disable
}