import L from "leaflet";
import { RoadLevel } from "./types";

import roads from "@src/assets/roads.geojson";

function styleCreator(level: RoadLevel | undefined): L.PathOptions {
    switch (level) {
        case "roadway":
            return { color: "#F4F5F7", weight: 6 ,lineCap:'butt'};
        case "railway":
            return { color: "#F4F5F7", weight: 3 ,lineCap:'butt'};
        default:
            return { color: "#F4F5F7", weight: 0.5,lineCap:'butt' };
    }
}

/**
 * 用于内部创建道路样式
 */
function extraStyleCreator(name: string): L.PathOptions {
    switch (name) {
        case "railway:cover":
            return { 
                color: "#000",
                weight: 3,
                lineCap:'butt',
                dashArray: [30,30],
            };
        default:
            return { color: "#F4F5F7", weight: 0.5 };
    }
}

function updateStyle(map: L.Map, polyline: L.Polyline, style: L.PathOptions) {
    const zoom = map.getZoom();
    //计算缩放因子
    const factor = (256 * 2 ** zoom) / 40075016.686;
    style.weight! *= factor;
    if (typeof style.dashArray === "object") {
        style.dashArray = style.dashArray.map((v:number) => {
            return v * factor;
        });
    }
    polyline.setStyle(style);
}

function loadRoads(map: L.Map, roads: GeoJSON.GeometryObject) {
    const layerGroup = L.layerGroup(void 0, {
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
            const polyline = L.polyline(coordinates).addTo(layerGroup);
            const level = feature.properties!.level as RoadLevel;
            updateStyle(map, polyline, styleCreator(level));
            map.on("zoomend", () => {
                updateStyle(map, polyline, styleCreator(level));
            });
            

            //铁路的额外线条
            if (level === "railway") {
                const extraPolyline = L.polyline(coordinates).addTo(layerGroup);
                updateStyle(map, extraPolyline, extraStyleCreator('railway:cover'));
                map.on("zoomend", () => {
                    updateStyle(map, extraPolyline, extraStyleCreator('railway:cover'));
                });
            }
        },
    });
}

function enalbe(map: L.Map) {
    loadRoads(map, roads);
}

function disable() {}

export default {
    enalbe,
    disable,
};
