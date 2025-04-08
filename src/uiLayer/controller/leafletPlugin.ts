import eventBus from "@src/eventBus";
import L from "leaflet";

import {Layer} from '@src/uiLayer/layerSelector'

let gloablMap:L.Map|null = null;

const hidenLayerGroup:L.LayerGroup[] = [];
const layerSelector = {
    requestLayersData(){
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
        eventBus.emit("layerSelector:response-layers-data",data);
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
        eventBus.on("layerSelector:request-layers-data",layerSelector.requestLayersData)
        eventBus.on("layerSelector:confirm",layerSelector.confirm)
    },
    disable(){
        eventBus.off("layerSelector:request-layers-data",layerSelector.requestLayersData)
        eventBus.off("layerSelector:confirm",layerSelector.confirm)
    }
}

function enalbe(map:L.Map){
    gloablMap = map;
    layerSelector.enalbe();
}

function disable(){
    layerSelector.disable();
    gloablMap = null;
}

export default {
    enalbe,
    disable
}