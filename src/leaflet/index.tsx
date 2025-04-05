import L from 'leaflet';
import style from "./style.module.css"

import MeasurerControl from "@src/measurer";
import zoomMeter from "@src/zoomMeter";
import placesLoader from '@src/placesLoader';
import tilesLoader from "@src/tilesLoader";
import roadsLoader from '@src/roadsLoader';
import layerController from '@src/layerController';

import { useEffect, useRef} from 'react';
import { Location } from './types';


import 'leaflet/dist/leaflet.css';
import "leaflet-rotate";

const MapPlugins = [
    tilesLoader,
    placesLoader,
    roadsLoader
];

const ControlPlugins = [
    {
        plugin:zoomMeter,
        options:{
            position: "topright"  
        }
    },
    {
        plugin:MeasurerControl,
        options:{
            position: "topleft"
        }
    },
    {
        plugin:layerController,
        options:{
            position: "topleft"
        }
    }
];

const defaultLocation:Location = [31.00123869701366, 121.00449874218026];


const MapComponent = () => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current!;
        element.style.backgroundColor = "#111D27";
        const map = L.map(element, {
            center: defaultLocation,
            zoom: 20,
            zoomControl: true,
            rotate: true,
            touchRotate: true,
            preferCanvas: true
        });


        // 加载控件插件
        for(let i=0;i<ControlPlugins.length;i++){
            const plugin = ControlPlugins[i].plugin;
            const options = ControlPlugins[i].options as L.ControlOptions;
            map.addControl(new plugin(options));
        }

        // 加载地图插件
        for(let i=0;i<MapPlugins.length;i++){
            const plugin = MapPlugins[i];
            plugin(map);
        }

        map.on('click', (e) => {
            console.log(`纬经:[${e.latlng.lat},${e.latlng.lng}]`);
        })
        return () => {
            map.remove();
        };
    }, []);
    

    return <div ref={elementRef} className={style.container}></div>;
};

export default MapComponent;
