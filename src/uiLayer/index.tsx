
import Navigation from "./navigation"
import SearchBox from "./searchBox"
import Box from '@mui/material/Box';
import Controller from "./controller"
import { SxProps, Theme } from '@mui/material/styles';


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
    return (
        //整个屏幕
        <Box sx={screenStyle}>
            {/* 搜索框 */}
            <Box sx={{
                position: 'absolute',
                width: '100%',
                top: '0',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <SearchBox />
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
                left: '4%',
                top: '10rem'
            }}>
                <Controller />
            </Box>
        </Box>
    )
}