import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';

import Controller from "./controller"
import Navigation from "./navigation"
import SearchBox from "./searchBox"
import LayerSelector from './layerSelector'
import SearchResult from "./searchResult";

import { SxProps, Theme } from '@mui/material/styles';
import { Ref } from "@src/utils";
import { useEffect } from "react";

const screenStyle: SxProps<Theme> = {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 999999,
    pointerEvents: "none",
    '& > *': {
        pointerEvents: "all" 
    }
};

  

export default function() {
    const topOffset = Ref(0);

    const searchInputvalue = Ref("");

    function updateViewOnResize(){
        const element = document.querySelector("body > div")!;
        const height = element.clientHeight;
        const width = element.clientWidth;
        const ratio = height/width;

        if(ratio > 2.1){
            //疑似全屏幕手机进入全屏
            topOffset.set(2); 
        }else{
            topOffset.set(0); 
        }
        
    }
    useEffect(() => {
        window.addEventListener("resize", updateViewOnResize);
        return () => {
            window.removeEventListener("resize", updateViewOnResize); 
        }
    })
    return (
        //整个屏幕
        <Box sx={screenStyle}>
            <LayerSelector></LayerSelector>
            {/* 搜索框 */}
            <Box sx={{
                position: 'absolute',
                width: '100%',
                top: topOffset.val+'rem',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <SearchBox searchInputvalue={searchInputvalue} />
                <SearchResult searchInputvalue={searchInputvalue} />
            </Box>
            {/* 底部导航 */}
            <Box sx={{
                position: 'absolute',
                width: '100%',
                bottom: '0'
            }}>
                <Navigation />
            </Box>
            {/* 控制器 */}
            <Box sx={{
                position: 'absolute',
                right: 0,
                top: 7+topOffset.val+'rem'
            }}>
                <Controller />
            </Box>
            {/* 浮动按钮导航 */}
            <Fab variant="extended" sx={{
                position: 'absolute',
                right: '1rem',
                bottom: '6rem',
            }}>
                <NavigationIcon sx={{ mr: 1 }} />
                导航
            </Fab>
        </Box>
    )
}