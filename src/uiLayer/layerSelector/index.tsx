import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import eventBus from '@src/eventBus';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Ref } from '@src/utils';
import { useEffect } from 'react';



export type Layer = {
    isShow: boolean,
    name: string
}
let layers: Layer[] = [];

function ItemsCreator() {
    return (
        <List sx={{ pt: 0, width: '20rem' }}>
            {layers.map((layer) => (
                <ListItem disablePadding key={layer.name}>
                    <ListItemButton sx={{
                        p: "0.5rem 2rem"
                    }}>
                        <FormControlLabel
                            value={layer}
                            control={<Checkbox onChange={() => { layer.isShow = !layer.isShow }} defaultChecked={layer.isShow} />}
                            label={layer.name}
                            labelPlacement='end'
                            sx={{
                                width: "100%"
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}


function layerSelector() {
    const isOpen = Ref(false);

    function onOpen() {
        eventBus.emit("layerSelector:request-layers-data");
    }


    function responseLayersData(event: CustomEvent) {
        const data = event.detail;
        layers = data;
        isOpen.set(true);
    }

    function confirm() {
        eventBus.emit("layerSelector:confirm", JSON.parse(JSON.stringify(layers)));
        layers.length = 0;
        isOpen.set(false);
    }

    useEffect(() => {
        eventBus.on("controller:layerSelector:open", onOpen);
        eventBus.on("layerSelector:response-layers-data", responseLayersData);
        return () => {
            eventBus.off("controller:layerSelector:open", onOpen);
            eventBus.off("layerSelector:response-layers-data", responseLayersData);
        }
    });

    return (
        <Dialog open={isOpen.val} sx={{
            zIndex: 99999999,
        }} disableRestoreFocus>
            <DialogTitle>选择图层</DialogTitle>
            {layers.length && ItemsCreator()}
            <DialogActions>
                <Button onClick={confirm}>
                    确定
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default layerSelector;
