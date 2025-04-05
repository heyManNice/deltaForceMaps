import L from 'leaflet';

export default function(map:L.Map){
    L.tileLayer('./tiles/{z}/{x}/{y}.png', {
        minZoom: 15,
        maxZoom: 21,
        tileSize: 256,
        attribution: 'deltaForceMaps'
    }).addTo(map);
}