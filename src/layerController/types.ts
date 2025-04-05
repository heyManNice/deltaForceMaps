import L from 'leaflet';


/**
 * 已经隐藏的图层
 */
export type Layers = {
    isHidden: boolean;
    layer: L.LayerGroup;
};