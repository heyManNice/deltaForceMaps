
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import StraightenIcon from '@mui/icons-material/Straighten';
import LayersIcon from '@mui/icons-material/Layers';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ExploreIcon from '@mui/icons-material/Explore';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import L from 'leaflet';

import {map,getReady} from '@src/leaflet';

import eventBus from "@src/eventBus";
import { Ref } from '@src/utils';
import {onMeasureClick} from '@src/measurer';

const inintialRotate = -45;

/**
 * 切换全屏模式
 */
function toggleFullscreen() {
    const element = document.body;
    if (!document.fullscreenElement) {
        element.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

/**
 * 地图放大缩小
 */
const zoomInOut = {
    zoomIn() {
        if(!map){
            return;
        }
        map.zoomIn();
    },
    zoomOut() {
        if(!map){
            return;
        }
        map.zoomOut(); 
    }
}


function openLayerSelector(){
    eventBus.emit("controller:layerSelector:open");
}

function uploadPlace(){
    if(!map){
        return;
    }
    const marker = L.marker([map.getCenter().lat, map.getCenter().lng]).addTo(map);
}

function buttonCreator(){
    const rotate = Ref(0);
    const isMeasureActive = Ref(false);
    //测量距离
    function measure() {
        onMeasureClick(!isMeasureActive.val);
        isMeasureActive.set(!isMeasureActive.val)
    }

    //指南针
    getReady().then(()=>{
        map!.on('rotate', (e) => {
            rotate.set(e.target.getBearing());
        });
    });

    function rorateReset() {
        if(!map){
            return;
        }
        map.setBearing(0);
        rotate.set(0);
    }

    return (
        [
        <Button key="zoomin" onClick={zoomInOut.zoomIn}>
            <ZoomInIcon />
        </Button>,


        <Button key="zoomout" onClick={zoomInOut.zoomOut}>
            <ZoomOutIcon />
        </Button>,

        <Button key="compass" onClick={rorateReset}>
            <ExploreIcon sx={{
            transform: `rotate(${inintialRotate+rotate.val}deg)`
            }} />
        </Button>,

        <Button key="add" onClick={uploadPlace}>
            <AddCircleIcon />
        </Button>,


        <Button key="measure" sx={{
            backgroundColor:isMeasureActive.val?"#CE93D8":""
        }} onClick={measure}>
            <StraightenIcon />
        </Button>,


        <Button key="layer" onClick={openLayerSelector}>
            <LayersIcon />
        </Button>,

        
        <Button key="fullscreen" onClick={toggleFullscreen}>
            <ZoomOutMapIcon />
        </Button>
        ]
    );
}

export default function GroupOrientation() {
  return (
    <ButtonGroup
        orientation="vertical"
        aria-label="Vertical button group"
        variant="contained"
        sx={{ width: '32px',marginRight:"1.5rem"}}
      >
        {buttonCreator()}
      </ButtonGroup>
  );
}
