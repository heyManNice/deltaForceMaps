
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';

import { Ref } from '@src/utils';
import { useEffect } from 'react';

const placeholders = [
    "卫星锅刷新点在哪里?",
    "大红!我要大红!",
    "老六阴🖊位",
    "跑刀路线"
];

function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function ({
    searchInputvalue
}: {
    searchInputvalue: {
        val: string;
        set: (newValue: string) => void;
    }
}) {
    const placeholderIndex = Ref(random(0, placeholders.length - 1));
    useEffect(() => {
        const interval = setInterval(() => {
            placeholderIndex.set(random(0, placeholders.length - 1));
        }, 5000);
        return () => clearInterval(interval);
    });
    return (
        <Paper
            component="form"
            sx={{
                p: '4px 4px',
                display: 'flex',
                alignItems: 'center',
                flex: '1 0 0',
                mt: "1rem",
                ml: "1rem",
                mr: "1rem",
                zIndex: 2,
            }}
        >
            <IconButton sx={{ p: '10px' }} aria-label="menu">
                <MenuIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={placeholders[placeholderIndex.val]}
                value={searchInputvalue.val}
                onChange={(e) => {
                    searchInputvalue.set(e.target.value);
                    e.preventDefault();
                }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
                <DirectionsIcon />
            </IconButton>
        </Paper>
    );
}
