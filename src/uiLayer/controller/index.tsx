import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

import StraightenIcon from '@mui/icons-material/Straighten';
import LayersIcon from '@mui/icons-material/Layers';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ExploreIcon from '@mui/icons-material/Explore';


const buttons = [
  <Button key="zoomin">
    <ZoomInIcon />
  </Button>,
  <Button key="zoomout">
    <ZoomOutIcon />
  </Button>,
  <Button key="compass">
    <ExploreIcon />
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
