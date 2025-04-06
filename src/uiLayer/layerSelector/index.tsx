import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import eventBus from '@src/eventBus';
import { Ref } from '@src/utils';
import { useEffect, useReducer } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';



export type Layer = {
    isShow:boolean,
    name:string
}
let layers:Layer[]=[

];

function Items(){
    return (
        <List sx={{ pt: 0, width: '20rem' }}>
            {layers.map((layer) => (
                <ListItem disablePadding key={layer.name}>
                    <ListItemButton sx={{
                        p:"0.5rem 2rem"
                    }}>
                        <FormControlLabel
                            value={layer}
                            control={<Checkbox onChange={()=>{layer.isShow=!layer.isShow}} defaultChecked={layer.isShow} />}
                            label={layer.name}
                            labelPlacement='end'
                            sx={{
                                width:"100%"
                            }}
                            />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}


function Loading(){
    return (
        <Box sx={{ display: 'flex',justifyContent:'center' }}>
          <CircularProgress />
        </Box>
      );
}


function layerSelector() {
    const isOpen = Ref(false);

    const [, forceRefresh] = useReducer((state) => state + 1, 0);

    function confirmHandle(){
        isOpen.set(false);
        const data:Layer[] = [];
        layers.map((layer)=>{
            data.push(layer);
        });
        eventBus.emit("layerSelector:confirm",data);
        layers.length=0;
    }
    function onControllerClick(){
        eventBus.emit("layerSelector:getNewLayersData");
        isOpen.set(true);
    }

    function layerOnload(event:CustomEvent){
        const data = event.detail;
        layers = data;
        forceRefresh();
    }

    useEffect(()=>{
        eventBus.on("layerSelector:ControllerClick",onControllerClick);
        eventBus.on("layerSelector:layerOnload",layerOnload);
        return ()=>{
            eventBus.off("layerSelector:ControllerClick",onControllerClick);
            eventBus.off("layerSelector:layerOnload",layerOnload);
        }
    });

    return (
        <Dialog open={isOpen.val} sx={{
            zIndex: 99999999,
        }} disableRestoreFocus>
            <DialogTitle>选择图层</DialogTitle>
                {layers.length?Items():Loading()}
            <DialogActions>
                <Button onClick={confirmHandle}>
                    确定
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default layerSelector
