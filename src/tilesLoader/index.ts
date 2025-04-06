import L from 'leaflet';


function enalbe(map:L.Map){
    const layerGroup = L.layerGroup(void 0,{
            pane: "卫星图",
        });
    layerGroup.addTo(map);
    L.tileLayer('./tiles/{z}/{x}/{y}.png', {
        minZoom: 15,
        maxZoom: 21,
        tileSize: 256,
        attribution: 'deltaForceMaps'
    }).addTo(layerGroup);
}

function disable(){
    
}

export default {
    enalbe,
    disable 
}