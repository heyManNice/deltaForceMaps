import L from 'leaflet';
import style from './style.module.css';
import { PlaceConfig,ZoomRange } from './types';

import places from '@src/assets/places.geojson';


function showPlaceMarker(place: PlaceConfig) {
    const textStyle = style[place.level+'-text'];
    const marker = L.marker(place.location, {
        title: place.name,
        icon: L.divIcon({
            className: style[place.level],
            html: `<div style="display: flex;justify-content: center;"><span ${textStyle?'class="'+textStyle+'"':''}>${place.name}</span></div>`,
            iconSize: [32,32],
            iconAnchor: [16,16],
        }),
        autoPan:false,

    })
    //如果没有设置缩放范围，始终显示
    if(ZoomRange[place.level]===void 0) {
        marker.addTo(place.layerGroup);
        return;
    }
    let isShow = false;

    function render() {
        const zoom = place.map.getZoom();
        const [min,max] = ZoomRange[place.level];

        if(zoom >= min && zoom <= max) {
            if(!isShow) {
                marker.addTo(place.layerGroup);
                isShow = true;
            }
            return;
        }
        if(isShow) {
            marker.remove();
            isShow = false;
        }
    }
    render();
    place.map.on("zoomend", () => {
        render();
    })
}


function loadPlaces(map:L.Map,places:GeoJSON.GeometryObject) {
    const layerGroup = L.layerGroup(void 0,{
            pane: "地标",
        });
    layerGroup.addTo(map);
    L.geoJSON(places, {
        onEachFeature: (feature, layer) => {
            const markerLayer = layer as L.Marker;
            const placeName = feature.properties.Name;
            const placeLevel = feature.properties.level;
            showPlaceMarker({
                map: map,
                layerGroup: layerGroup,
                name: placeName,
                level: placeLevel,
                location: markerLayer.getLatLng(),
            })
        }
    })
}


function enalbe(map:L.Map){
    loadPlaces(map,places);
}

function disable(){
    
}

export default {
    enalbe,
    disable
}