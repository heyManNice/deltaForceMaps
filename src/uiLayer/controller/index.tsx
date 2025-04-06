
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import StraightenIcon from '@mui/icons-material/Straighten';
import LayersIcon from '@mui/icons-material/Layers';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ExploreIcon from '@mui/icons-material/Explore';

import eventBus from "@src/eventBus";
import { Ref } from '@src/utils';

const inintialRotate = -45;

function zoomIn() {
  eventBus.emit('UiLayerControl:zoomIn');
}

function zoomOut() {
    eventBus.emit('UiLayerControl:zoomOut'); 
}

function toggleFullscreen() {
    const element = document.body;
    if (!document.fullscreenElement) {
        element.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}


function layerSelectorControllerClick(){
    eventBus.emit("layerSelector:ControllerClick");
}

function buttonCreator(){
    const rotate = Ref(0);
    const isMeasureActive = Ref(false);
    function measure() {
        eventBus.emit('UiLayerControl:measure',{
            isActive:!isMeasureActive.val
        });
        isMeasureActive.set(!isMeasureActive.val)
    }

    function rorateReset() {
        eventBus.emit('UiLayerControl:rotateReset');
        rotate.set(0);
    }

    eventBus.on('UiLayerControl:rotate', (event:CustomEvent) => {
        const r = event.detail;
        if(isNaN(r)){
            console.warn(`UiLayerControl:rotate event.detail '${r}' is not a number`);
            return;
        }
        rotate.set(r);
    })

    return (
        [
        <Button key="zoomin" onClick={zoomIn}>
            <ZoomInIcon />
        </Button>,


        <Button key="zoomout" onClick={zoomOut}>
            <ZoomOutIcon />
        </Button>,


        <Button key="compass" onClick={rorateReset}>
            <ExploreIcon sx={{
            transform: `rotate(${inintialRotate+rotate.val}deg)`
            }} />
        </Button>,


        <Button key="measure" sx={{
            backgroundColor:isMeasureActive.val?"#CE93D8":""
        }} onClick={measure}>
            <StraightenIcon />
        </Button>,


        <Button key="layer" onClick={layerSelectorControllerClick}>
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
