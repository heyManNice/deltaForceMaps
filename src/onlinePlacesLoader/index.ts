import L from 'leaflet';
import style from './style.module.css';

const api = `https://api.github.com/repos/heyManNice/deltaForceMaps/issues`;

const zoomRange = [20,21];

let gloablMap:L.Map|null = null;
const markerGroup = L.layerGroup(void 0,{
    pane: "用户上传地标",
});

/**
 * 防抖函数
 * @param callback 回调函数
 * @param delay 延迟时间
 */
function debounce(callback:Function, delay:number = 1000){
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
    for(let i=0;i<locationDatas.length;i++){
        const locationData = locationDatas[i];
        const marker = L.marker([31.006484145313305,121.00624850096371],{
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
    if(gloablMap){
        markerGroup.addTo(gloablMap);
    }
}


const debouncedParseIssue = debounce(parseIssue, 50);

function fetchOnZoomed(){
    if(!gloablMap){
        return;
    }
    const zoom = gloablMap.getZoom();
    if(zoom >= zoomRange[0] && zoom <= zoomRange[1]){
        debouncedParseIssue();
        gloablMap.off("zoomend",fetchOnZoomed);
    }
}



function enalbe(map:L.Map){
    gloablMap = map;
    map.on("zoomend",fetchOnZoomed);
}

function disable(){
    if(!gloablMap){
        return;
    }
    gloablMap.off("zoomend",fetchOnZoomed);
    markerGroup.remove();
    markerGroup.clearLayers();
    gloablMap = null;
}

export default {
    enalbe,
    disable
};