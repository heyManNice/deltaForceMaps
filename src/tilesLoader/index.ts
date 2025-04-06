import L from 'leaflet';


function enalbe(map:L.Map){
    L.tileLayer('./tiles/{z}/{x}/{y}.png', {
        minZoom: 15,
        maxZoom: 21,
        tileSize: 256,
        attribution: 'deltaForceMaps'
    }).addTo(map);
}

function disable(){
    
}

export default {
    enalbe,
    disable 
}