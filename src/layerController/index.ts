import L from 'leaflet';
import {Layers} from './types';
import eventBus from '@src/eventBus';

const icon = `<svg t="1743873125978" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2647" width="200" height="200"><path d="M512 78.769231l433.230769 315.076923-433.230769 315.076923L78.769231 393.846154 512 78.769231z m352 492.307692L945.230769 630.153846 512 945.230769 78.769231 630.153846l81.230769-59.076923L512 827.076923l352-256z" fill="#333333" p-id="2648"></path></svg>`;


const layers: Layers[] = [];

/**
 * 获取图层组
 */
function getLayers(map: L.Map) {
    const layers: Layers[] = [];
    map.eachLayer(function (layer) {
        if (layer instanceof L.LayerGroup) {
            layers.push({
                isHidden: false,
                layer: layer,
            });
        }
    });
    return layers;
}

const layerController = L.Control.extend({
    onAdd: function (map: L.Map) {
        //初始化样式
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        L.DomEvent.disableClickPropagation(container);
        container.style.backgroundColor = "white";
        container.style.boxShadow = "0 0 2px rgba(0, 0, 0, 0.2)";
        container.style.borderRadius = "3px";
        container.style.cursor = "pointer";
        container.style.width = "30px";
        container.style.height = "30px";
        container.style.display = "flex";
        container.style.justifyContent = "center";
        container.style.alignItems = "center";
        container.innerHTML = icon;
        container.title = "图层";
        const svg = container.children[0] as HTMLElement;
        svg.style.width = "60%";
        svg.style.height = "60%";

        //初始化事件

        container.onclick = () => {
            if(!layers.length){
                layers.push(...getLayers(map));
            }
            console.log(layers);
            eventBus.emit<Layers[]>('layerController-button-click',layers);
        }

        return container;
    },
})


export default layerController;