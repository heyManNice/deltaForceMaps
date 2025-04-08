import L from "leaflet";

import _routes from "@src/assets/routes.geojson";

import "@src/libs/MovingMarker.js"


let globalMap:L.Map|null = null;
let line:L.Polyline|null = null;

declare module 'leaflet' {
    namespace Marker {
        function movingMarker(
            latlngs: L.LatLngExpression[] | L.LatLngExpression[][],
            durations: number | number[],
            options?: L.MarkerOptions
        ): MovingMarker;
    }
    class MovingMarker extends L.Marker {
        start(): void;
        stop(): void;
        isRunning(): boolean;
        pause(): void;
        resume(): void;
        addLatLng(latlng: L.LatLngExpression, duration?: number): void;
    }
}

const routes = _routes.features;

function updateStyle(map: L.Map, polyline: L.Polyline, _style: L.PathOptions) {
    const zoom = map.getZoom();
    //计算缩放因子
    const factor = (256 * 2 ** zoom) / 40075016.686;
    const style = JSON.parse(JSON.stringify(_style));
    style.weight! *= factor;
    polyline.setStyle(style);
}

const style = {
    color: "#00ff54",
    weight: 3,
    lineJoin: "round",
} as L.PathOptions;


function routePlay(route:L.LatLngExpression[]){
    const map = globalMap!;
    const movingMarker = L.Marker.movingMarker(route,65000,{
        icon: L.icon({
            iconUrl: "leaflet/images/arrow.png",
            iconSize: [64, 64],
            iconAnchor: [32, 32], 
        })
    }).addTo(map);
    setTimeout(()=>{
        movingMarker.start();
    },300);
    let p = movingMarker.getLatLng();
    const lastPositionArray = [p,p,p,p,p,p,p,p,p,p];
    let count = 0;
    map.setView(p, 20, {
        animate: true
    });

    setTimeout(()=>{
        monitorPosition();
    },300);

    function monitorPosition() {
        if (movingMarker.isRunning()) {
            const position = movingMarker.getLatLng();
            count++;
            if(count>20){
                count = 0;
                map.setView(position, map.getZoom(), {
                    animate: true,
                    duration: 2,
                    easeLinearity: 0.5,
                });
            }
            //通过当前点和上个点计算角度
            const lastPosition = lastPositionArray.shift()!;
            const tagAngle = Math.atan2(position.lat - lastPosition.lat, position.lng - lastPosition.lng) * 180 / Math.PI;
            lastPositionArray.push(position);
            map.setBearing(tagAngle-90);
            requestAnimationFrame(monitorPosition);
        }else{
            movingMarker.remove();
            clearRoute();
        }
    }
    
}

function _updataStyle(){
    updateStyle(globalMap!, line!, style);
}

function drowRoute(route:L.LatLngExpression[]){
    const map = globalMap!;
    line = new L.Polyline(route).addTo(map);
    updateStyle(map, line, style);
    map.on("zoomend", _updataStyle);
}

function clearRoute(){
    globalMap!.off("zoomend", _updataStyle);
    if(line){
        line.remove(); 
    } 
}

const route = routes[0].geometry.coordinates[0].map(([lat, lng]:[number,number]) => [lng, lat]);

export function play(){
    const audio = new Audio("./voice/发射区-离心室.mp3");
    audio.play();
    routePlay(route);
}

export function preview(){
    drowRoute(route);
    globalMap!.setView([31.001892005612973,121.00500049281221], 17, { animate: true });
    globalMap!.setBearing(-45);
    showUI();
}

function showUI(){
    //临时测试效果
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.bottom = "-40rem";
    div.style.height = "fit-content";
    div.style.padding = "2rem 2rem";
    div.style.left = "0";
    div.style.right = "0";
    div.style.backgroundColor = "rgba(255, 255, 255)";
    div.style.color = "#000";
    div.style.zIndex = "9999999";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.transition = "all 0.5s ease-in-out";
    document.querySelector("body>div")?.appendChild(div);
    div.innerHTML = `
        <p style="
            font-size: 2rem;
            font-weight: bold;
        ">发射区-离心室</p>
        <p style="
            margin: 1rem 0 2rem 0;
            font-size: 1.5rem;
        ">372米，预计1分05秒</p>
        <button style="
            background-color: #1976D2;
            color: #fff;
            outline: none;
            border: none;
            height: 3rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            margin-bottom: 2rem;
            cursor: pointer;
        " id="playBtn">开始导航</button>
    `;
    setTimeout(()=>{
        div.style.bottom = "0";
    });
    const btn = div.querySelector("#playBtn")! as HTMLButtonElement;
    btn.onclick=()=>{
        play();
        div.style.bottom = "-40rem";
        setTimeout(()=>{
            div.remove();
        },500);
    }
}

function enalbe(map: L.Map) {
    globalMap = map;
}

function disable() {
}

export default {
    enalbe,
    disable,
};
