import L from 'leaflet';
import {map} from '@src/leaflet';

let isActive = false;

const markers: L.Marker[] = [];

let clearMeasured = ()=>{
    
}

function measure(event: L.LeafletMouseEvent){
    if(!map){
        return; 
    }
    const location: L.LatLngExpression = event.latlng;
    if(!isActive) return;
    if(markers.length===2){
        //如果发现已经有了两个标记，就清空他们，重新开始
        markers.forEach((marker)=>{
            marker.removeFrom(map!);
        })
        markers.length = 0;
        clearMeasured();
    }
    const marker = L.marker(location).addTo(map)
    markers.push(marker);
    if(markers.length===2){
        //添加标记后达到两个，就计算距离
        const a = markers[0].getLatLng();
        const b = markers[1].getLatLng();

        const line = L.polyline([a,b],{color:"#1976D2"}).addTo(map);

        const distance = a.distanceTo(b);
        const midPoint = new L.LatLng(
            (a.lat + b.lat) / 2,
            (a.lng + b.lng) / 2, 
        )
        const tooltip = L.tooltip({
            permanent: true,
            direction: 'center',
            opacity: 0.7,
            className: "leaflet-tooltip-custom",
            offset: [0, -10],
        }).setLatLng(midPoint)
        .setContent(`距离: ${distance.toFixed(2)}米`)
        .addTo(map)

        //确保两点都能看到
        const bounds = L.latLngBounds([a,b]);
        map.fitBounds(bounds,{padding:[10,10]});

        clearMeasured = ()=>{
            line.remove();
            tooltip.remove();
        }
    }
}

function initMeasure(){
    if(map){
        map.on('click', measure);
    }else{
        setTimeout(initMeasure, 500);
    }
}

initMeasure();

export function onMeasureClick(active:boolean) {
    if(!map){
        return; 
    }
    isActive = active;
    if(isActive) {
        map.getContainer().style.cursor = 'crosshair'; 
    }else{
        map.getContainer().style.cursor = 'grab';
        markers.forEach((marker)=>{
            marker.remove();
        })
        markers.length = 0;
        clearMeasured();
    };
}
