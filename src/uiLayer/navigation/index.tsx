import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';



export default function(){
    return (
        <BottomNavigation showLabels>
            <BottomNavigationAction label="首页" icon={<HomeIcon />} />
            <BottomNavigationAction label="最近" icon={<RestoreIcon />} />
            <BottomNavigationAction label="我的" icon={<LocationOnIcon />} />
        </BottomNavigation>
    )

}