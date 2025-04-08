import L from 'leaflet';

import placesLoader from '@src/placesLoader';
import tilesLoader from "@src/tilesLoader";
import roadsLoader from '@src/roadsLoader';
import controller from '@src/uiLayer/controller/leafletPlugin';
import onlinePlacesLoader from '@src/onlinePlacesLoader';

import { useEffect, useRef} from 'react';
import { Location } from './types';

import 'leaflet/dist/leaflet.css';
import "leaflet-rotate";
import { Box } from '@mui/material';



const MapPlugins = [
    tilesLoader,
    placesLoader,
    roadsLoader,
    controller,
    onlinePlacesLoader
];

const defaultLocation:Location = [31.00123869701366, 121.00449874218026];


L.Icon.Default.imagePath = '/leaflet/images/';


export let map:L.Map|null = null;


export function getReady(){
    return new Promise<L.Map>((resolve)=>{
        if(map){
            resolve(map);
            return;
        }
        let tryCount = 0;
        const interval = setInterval(()=>{
            tryCount++;
            if(tryCount > 100){
                throw new Error("地图获取失败，请联系开发者");
            }
            if(map){
                clearInterval(interval);
                resolve(map);
            }
        },100);
    });
}


const MapComponent = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }
        map = L.map(containerRef.current, {
            center: defaultLocation,
            zoom: 20,
            zoomControl: false,
            rotateControl: false,
            rotate: true,
            touchRotate: true,
            preferCanvas: true,
        });
        
        
        // 加载插件
        for(let i=0;i<MapPlugins.length;i++){
            const plugin = MapPlugins[i];
            plugin.enalbe(map);
        }
        
        map.on('click', (e) => {
            console.log(`纬经:[${e.latlng.lat},${e.latlng.lng}]`);
        })

        return () => {
            for(let i=0;i<MapPlugins.length;i++){
                const plugin = MapPlugins[i];
                plugin.disable();
            }
            map?.remove();
        };
    }, []);
    

    return (
        <Box ref={containerRef} sx={{
            height: "100%",
            width: "100%",
        }}></Box>
    )
};

export default MapComponent;
