
import L from 'leaflet';

const zoomMeter = L.Control.extend({
    onAdd: function (map: L.Map) {
        const container = L.DomUtil.create("div", "zoom-level-control");
        container.style.backgroundColor = "white";
        container.style.padding = "5px";
        container.style.boxShadow = "0 0 2px rgba(0, 0, 0, 0.2)";
        container.style.borderRadius = "3px";
        container.innerHTML = `缩放: ${map.getZoom()}`;
        map.on("zoomend", () => {
            container.innerHTML = `缩放: ${map.getZoom()}`;
        });
        return container;
    }
});

export default zoomMeter;