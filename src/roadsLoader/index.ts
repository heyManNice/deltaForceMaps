import L from "leaflet";
import { RoadLevel } from "./types";

import roads from '@src/assets/roads.geojson';

function styleCreator(level: RoadLevel | undefined) {
    switch (level) {
        case "roadway":
            return { color: "#F4F5F7", weight: 6 };
        default:
            return { color: "#F4F5F7", weight: 0.5 };
    }
}

function updateStyle(map: L.Map, polyline: L.Polyline, level?: RoadLevel) {

    let style = styleCreator(level);

    const zoom = map.getZoom();
    //计算缩放因子
    const factor = (256 * 2 ** zoom) / 40075016.686;
    style.weight *= factor;

    polyline.setStyle(style);
}

function loadRoads(map: L.Map, roads: GeoJSON.GeometryObject) {
    const layerGroup = L.layerGroup(void 0,{
        pane: "道路",
    });
    layerGroup.addTo(map);
    L.geoJSON(roads, {
        onEachFeature: function (_feature, _layer) {
            const feature = _feature as GeoJSON.Feature<GeoJSON.LineString>;
            //转换坐标
            function convert(coord: [number, number]): [number, number] {
                return [coord[1], coord[0]];
            }
            const _coordinates = feature.geometry.coordinates[0] as unknown as [
                number,
                number,
            ][];
            const coordinates = _coordinates.map(convert);
            //绘制路线
            const polyline = L.polyline(coordinates);
            const level = feature.properties!.level as RoadLevel;
            updateStyle(map, polyline, level);
            map.on("zoomend", () => {
                updateStyle(map, polyline, level);
            });
            polyline.addTo(layerGroup);
        },
    });
}


function enalbe(map: L.Map) {
    loadRoads(map, roads);
}

function disable() { }

export default {
    enalbe,
    disable,
}
