import L from 'leaflet';
import style from "./style.module.css"

import placesLoader from '@src/placesLoader';
import tilesLoader from "@src/tilesLoader";
import roadsLoader from '@src/roadsLoader';
import controller from '@src/uiLayer/controller/leafletPlugin';

import { useEffect, useRef} from 'react';
import { Location } from './types';



import 'leaflet/dist/leaflet.css';
import "leaflet-rotate";

const MapPlugins = [
    tilesLoader,
    placesLoader,
    roadsLoader,
    controller
];

const defaultLocation:Location = [31.00123869701366, 121.00449874218026];


const MapComponent = () => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current!;
        element.style.backgroundColor = "#111D27";

        L.Icon.Default.imagePath = '/leaflet/images/';

        const map = L.map(element, {
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
            // 移除
            for(let i=0;i<MapPlugins.length;i++){
                const plugin = MapPlugins[i];
                plugin.disable();
            }
            map.remove();
        };
    }, []);
    

    return <div ref={elementRef} className={style.container}></div>;
};

export default MapComponent;
