
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import StraightenIcon from '@mui/icons-material/Straighten';
import LayersIcon from '@mui/icons-material/Layers';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ExploreIcon from '@mui/icons-material/Explore';

import eventBus from "@src/eventBus";

const inintialRotate = -45;

function zoomIn() {
  eventBus.emit('UiLayerControl:zoomIn');
}
function zoomOut() {
    eventBus.emit('UiLayerControl:zoomOut'); 
}

const buttons = [
  <Button key="zoomin" onClick={zoomIn}>
    <ZoomInIcon />
  </Button>,
  <Button key="zoomout" onClick={zoomOut}>
    <ZoomOutIcon />
  </Button>,
  <Button key="compass">
    <ExploreIcon sx={{
      transform: `rotate(${inintialRotate}deg)`
    }} />
  </Button>,
  <Button key="measure">
    <StraightenIcon />
  </Button>,
  <Button key="layer">
    <LayersIcon />
  </Button>,
  <Button key="fullscreen">
    <ZoomOutMapIcon />
  </Button>
];

export default function GroupOrientation() {
  return (
    <ButtonGroup
        orientation="vertical"
        aria-label="Vertical button group"
        variant="contained"
        sx={{ width: '32px',marginRight:"1.5rem"}}
      >
        {buttons}
      </ButtonGroup>
  );
}
