import L from "leaflet";
import { RoadLevel } from "./types";

type RoadStyle = Record<RoadLevel, L.PathOptions>;

export const roadStyles: RoadStyle = {
    "roadway": {
        color: "#F4F5F7",
        weight: 6,
        lineCap: "butt",
    },
    "railway": {
        color: "#F4F5F7",
        weight: 3,
        lineCap: "butt",
    },
    "indoorPassage": {
        color: "#F4F5F7",
        weight: 0.5,
        lineCap: "butt",
    },
    "pedestrianPath":{
        color: "#F4F5F7",
        weight: 0.5,
        lineCap: "butt",
    },
    "shortcutPath":{
        color: "#F4F5F7",
        weight: 0.5,
        lineCap: "butt",
    },
    "stairway":{
        color: "#F4F5F7",
        weight: 0.5,
        lineCap: "butt",
    },
    "ziplinePath":{
        color: "#F4F5F7",
        weight: 0.5,
        lineCap: "butt",
    },
};


type ExtraRoadStyle = Record<string, L.PathOptions>;

export const extraRoadStyles: ExtraRoadStyle = {
    "railway:cover": {
        color: "#000",
        weight: 3,
        lineCap: "butt",
        dashArray: [30, 30],
    },
};