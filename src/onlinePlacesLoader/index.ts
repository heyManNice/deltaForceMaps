import L from 'leaflet';
import style from './style.module.css';
import { debounce } from '@src/utils';

const api = `https://api.github.com/repos/heyManNice/deltaForceMaps/issues`;

type OnlinePlace = {
    htmlUrl:string,
    userName:string,
    avatarUrl:string,
    locationDatas:{
        name:string,
        location:L.LatLngExpression,
    }[]
}

export const onlinePlaces:OnlinePlace[] = [];

const zoomRange = [20,21];

let gloablMap:L.Map|null = null;
const markerGroup = L.layerGroup(void 0,{
    pane: "用户上传地标",
});



function parseIssue(){
    fetch(api).then((res) => {
        return res.json();
    }).then((data) => {
        if(!data || data.length === 0){
            console.log("为获取到在线地标");
            return;
        }
        data.map((item:any) => {
            if(item.title !== "添加地标"){
                return;
            }
            addMarker(item);
        })
    })
}


type LocationData = {
    name:string,
    location:L.LatLngExpression,
}[];

/**
 * 解析经纬度
 * @param body issue的body部分
 */
function parseLocation(body:any):LocationData{
    const regex = /(^|\n).+:\[.+,.+]($|\n)/g
    const match = body.match(regex);
    if(!match || match.length === 0){
        return [];
    }
    const data:LocationData = [];
    match.map((item:any) => {
        try {
            const [name, location] = item.split(":");
            const [lat, lng] = location.replace(/[\[\]]/g, "").split(",");
            data.push({
                name:name.replace(/(^\s+|\s+$)/g,""),
                location:[parseFloat(lat), parseFloat(lng)]
            });
        } catch (error) {
            console.warn("解析地标失败",error);
        }
    });
    return data;
}

/**
 * 添加地标
 */
function addMarker(issue:any){
    const htmlUrl = issue.html_url??"";
    const userName = issue.user.login??"未知用户";
    const avatarUrl = issue.user.avatar_url??"";
    const locationDatas = parseLocation(issue.body);
    onlinePlaces.push({
        htmlUrl,
        userName,
        avatarUrl,
        locationDatas,
    });
    for(let i=0;i<locationDatas.length;i++){
        const locationData = locationDatas[i];
        const marker = L.marker(locationData.location,{
            title: locationData.name,
            icon: L.divIcon({
                className: style["online-place"],
                html: `<div style="display: flex;justify-content: center;"><span class="${style["online-place-text"]}" >${locationData.name}</span></div>`,
                iconSize: [32,32],
                iconAnchor: [16,16],
            }),
            autoPan:false,
    
        });
        marker.bindPopup(`<div style="display: flex;align-items: center;gap: 0.5rem;">
            <img src="${avatarUrl}" alt="用户头像" style="width: 2rem;height: 2rem;border-radius: 50%;"/>
            <span>由 ${userName} 提供</span>
            <a href="${htmlUrl}" target="_blank">反馈</a>
        </div>`);

        let isShow = false;
        function render(){
            const zoom = gloablMap?.getZoom()??0;
            if(zoom >= zoomRange[0] && zoom <=zoomRange[1]){
                if(!isShow){
                    marker.addTo(markerGroup);
                    isShow = true;
                }
            }else{
                if(isShow){
                    marker.remove();
                    isShow = false;
                }
            }
        }

        render();

        gloablMap?.on("zoomend",()=>{
            render();
        });
    }
}


const debouncedParseIssue = debounce(parseIssue, 50);

let loaded = false;

function fetchOnZoomed(){
    if(!gloablMap){
        return;
    }
    if(loaded){
        return;
    }
    loaded = true;
    const zoom = gloablMap.getZoom();
    if(zoom >= zoomRange[0] && zoom <= zoomRange[1]){
        debouncedParseIssue();
        gloablMap.off("zoomend",fetchOnZoomed);
    }
}

export function loadOnlinePlaces(){
    fetchOnZoomed();
}


function enalbe(map:L.Map){
    gloablMap = map;
    map.on("zoomend",fetchOnZoomed);
    markerGroup.addTo(map);
}

function disable(){
    if(!gloablMap){
        return;
    }
    gloablMap.off("zoomend",fetchOnZoomed);
    markerGroup.remove();
    markerGroup.clearLayers();
    gloablMap = null;
    loaded = false;
}

export default {
    enalbe,
    disable
};