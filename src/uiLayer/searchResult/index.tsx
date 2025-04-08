
import Box from '@mui/material/Box';
import PlaceIcon from '@mui/icons-material/Place';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { map } from "@src/leaflet"


import _places from "@src/assets/places.geojson";
const places = _places.features.map((feature: any) => {
    return feature;
});

function searchPlaces(query: string) {
    let results = places.filter((place: any) => {
        return place.properties.Name.includes(query.trim());
    });
    results = JSON.parse(JSON.stringify(results));
    for (let i = 0; i < results.length; i++) {
        const place = results[i];
        place.properties.Name = place.properties.Name.replace(query.trim(), `<b>${query.trim()}</b>`);
    }
    return results;
}

function parsePlace(places: any) {
    return places.map((place: any) => {
        return {
            Name: place.properties.Name,
            level: place.properties.Level,
            location: [place.geometry.coordinates[1], place.geometry.coordinates[0]],
            icon: <PlaceIcon sx={{
                margin:'0 1rem'
            }} />,
        };
    });
}



export default function SearchResult({
    searchInputvalue
}: {
    searchInputvalue: {
        val: string;
        set: (newValue: string) => void;
    }
}) {
    const items = parsePlace(searchPlaces(searchInputvalue.val));
    function itemClickHandler(item: any) {
        searchInputvalue.set("");
        map!.flyTo(item.location,20);
    }
    if (searchInputvalue.val === "") return <></>;
    return (
        <Box sx={{
            bgcolor: 'background.paper',
            borderRadius: '0 0 10px 10px',
            flex: '1 0 0',
            ml: "1rem",
            mr: "1rem",
            zIndex: 1,
            position: 'relative',
        }}>
            <List>
                {items.length > 0 && items.map((item: any, index: number) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => { itemClickHandler(item) }}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={
                                    <span dangerouslySetInnerHTML={{ __html: item.Name }} />
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
                {items.length === 0 && (
                    <ListItem disablePadding>
                        <ListItemText sx={{
                            textAlign: 'center',
                        }}
                        primary="没有找到相关地点" />
                    </ListItem>)}
            </List>
        </Box>
    );
}