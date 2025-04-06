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
