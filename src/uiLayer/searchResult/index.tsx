
import Box from '@mui/material/Box';
import PlaceIcon from '@mui/icons-material/Place';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { onlinePlaces, loadOnlinePlaces } from '@src/onlinePlacesLoader';

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
                margin: '0 1rem'
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
    if (searchInputvalue.val === "") return <></>;
    const items = parsePlace(searchPlaces(searchInputvalue.val));

    if (onlinePlaces.length === 0) {
        loadOnlinePlaces();
    }

    const onlinePlacesResult = [];

    if (onlinePlaces.length > 0) {
        for (const user of onlinePlaces) {
            for (const j of user.locationDatas) {
                if (!j.name.includes(searchInputvalue.val.trim())) {
                    continue;
                }
                onlinePlacesResult.push({
                    Name: j.name.replace(searchInputvalue.val.trim(), `<b>${searchInputvalue.val.trim()}</b>`),
                    level: 'null',
                    location: j.location,
                    icon: <img src={user.avatarUrl} alt={user.userName} style={{ width: '20px', height: '20px', borderRadius: '50%',paddingLeft:'2px', margin: '0 1rem' }} />,
                });
            }
        }
    }

    function itemClickHandler(item: any) {
        searchInputvalue.set("");
        map!.flyTo(item.location, 20);
    }
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
                {onlinePlacesResult.length > 0 && onlinePlacesResult.map((item: any, index: number) => (
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