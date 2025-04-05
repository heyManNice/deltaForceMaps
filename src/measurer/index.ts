import L from 'leaflet';

const icon = `<svg t="1743850649111" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2722" width="200" height="200"><path d="M171.240049 718.68079l137.569214 137.58343 56.835973-56.835974-137.583429-137.583429 74.86199-74.86199 136.275548 136.275548 56.835973-56.835974-136.275548-136.275548 73.411948-73.397731 188.44864 188.44864 56.835973-56.835973-188.44864-188.44864 74.193833-74.193834 135.792201 135.777985 56.835973-56.835974-135.7922-135.777984 72.075634-72.075634L874.453721 378.148297l56.835974-56.835973L749.949105 139.971734l83.135761-83.135761L776.248893 0 7.925477 768.323416l56.835973 56.835974 106.478599-106.4786zM860.138107 868.063584v35.11377H163.861893v-35.11377H7.925477v155.936416h155.936416V988.872013h696.276214v35.127987h155.936416V868.063584H860.138107z" p-id="2723"></path></svg>`


let isActive = false;

const markers: L.Marker[] = [];

let clearMeasured = ()=>{
    
}

function measure(map: L.Map,location: L.LatLngExpression){
    if(markers.length===2){
        //如果发现已经有了两个标记，就清空他们，重新开始
        markers.forEach((marker)=>{
            marker.removeFrom(map);
        })
        markers.length = 0;
        clearMeasured();
    }
    markers.push(L.marker(location).addTo(map));
    if(markers.length===2){
        //添加标记后达到两个，就计算距离
        const distance = markers[0].getLatLng().distanceTo(markers[1].getLatLng());
        const line = L.polyline([markers[0].getLatLng(),markers[1].getLatLng()],{color:"#FFA500"}).addTo(map);
        const tooltip = L.tooltip({
            permanent: true,
            direction: 'center',
            opacity: 0.7,
            className: "leaflet-tooltip-custom",
            offset: [0, -10],
        }).setLatLng(markers[1].getLatLng())
        .setContent(`距离: ${distance.toFixed(2)}米`)
        .addTo(map)

        clearMeasured = ()=>{
            line.removeFrom(map);
            tooltip.removeFrom(map);
        }
    }
}

function updateStyle(container: HTMLElement) {
    container.style.backgroundColor = isActive ? "#FFA500" : "white";
}

const MeasurerControl = L.Control.extend({
    onAdd: function (map: L.Map) {
        //初始化样式
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        L.DomEvent.disableClickPropagation(container);
        container.style.backgroundColor = "white";
        container.style.boxShadow = "0 0 2px rgba(0, 0, 0, 0.2)";
        container.style.borderRadius = "3px";
        container.style.cursor = "pointer";
        container.style.width = "30px";
        container.style.height = "30px";
        container.style.display = "flex";
        container.style.justifyContent = "center";
        container.style.alignItems = "center";
        container.innerHTML = icon;
        container.title = "测量";
        const svg = container.children[0] as HTMLElement;
        svg.style.width = "60%";
        svg.style.height = "60%";

        //初始化事件

        container.onclick = () => {
            //切换状态
            isActive = !isActive;

            //在新状态进行操作
            updateStyle(container);
            if(isActive) {
                map.getContainer().style.cursor = 'crosshair'; 
            }else{
                map.getContainer().style.cursor = 'grab';
                markers.forEach((marker)=>{
                    marker.removeFrom(map);
                })
                markers.length = 0;
                clearMeasured();
            };
        }

        map.on("click", (e) => {
            if(!isActive) return;
            measure(map,e.latlng);
        })

        return container;
    },

})


export default MeasurerControl;