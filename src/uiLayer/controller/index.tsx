import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

const buttons = [
  <Button key="one">一</Button>,
  <Button key="two">二</Button>,
  <Button key="three">三</Button>,
];

export default function GroupOrientation() {
  return (
    <ButtonGroup
        orientation="vertical"
        aria-label="Vertical button group"
        variant="contained"
      >
        {buttons}
      </ButtonGroup>
  );
}
