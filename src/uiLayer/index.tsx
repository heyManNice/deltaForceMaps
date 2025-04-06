
import style from "./style.module.css"
import Navigation from "./navigation"
import SearchBox from "./searchBox"
import Box from '@mui/material/Box';
import Controller from "./controller"


export default function() {
    return (
        <div className={style.screen}>
            <div className={style.top}>
                <SearchBox />
            </div>
            <div className={style.bottom}>
                <Navigation />
            </div>
            <Box sx={{
                position: 'absolute',
                left: '4%',
                top: '10rem'
            }}>
                <Controller />
            </Box>
        </div>
    )
}