import L from 'leaflet';
import { Location,loadImageConfig } from '../leaflet/types';
import { useState } from 'react';


export function print(...args: any[]) {
    console.log(...args)
}

/**
 * 加载图片到地图上
 * @param config 
 * @returns 
 */
export function loadImage(config: loadImageConfig): L.ImageOverlay {
    const image = new Image();
    image.src = config.imageUrl;

    const origin = config.location;
    const endPoint: Location = [
        origin[0] + image.height * config.scale,
        origin[1] + image.width * config.scale
    ];

    const imageBounds: L.LatLngBoundsLiteral = [
        origin,
        endPoint
    ];
    return L.imageOverlay(config.imageUrl, imageBounds);
}

export function Ref<T>(initialValue: T) {
  const [value, setter] = useState(initialValue);
  return {
    val: value,
    set: (newValue: T) => {
      setter(newValue);
    },
  };
}


/**
 * 防抖函数
 * @param callback 回调函数
 * @param delay 延迟时间
 */
export function debounce(callback:Function, delay:number = 1000){
    let timer:any = null;
    return function(...args:any){
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    }
}