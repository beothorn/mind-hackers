import { ExpandableList } from './ExpandableList';
import { ExpandableElement } from './ExpandableElement';
import React from 'react'
import '@fontsource/roboto/300.css';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WcIcon from '@mui/icons-material/Wc';
import KeyIcon from '@mui/icons-material/Key';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import WomanIcon from '@mui/icons-material/Woman';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SetMealIcon from '@mui/icons-material/SetMeal';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ComputerIcon from '@mui/icons-material/Computer';
import PetsIcon from '@mui/icons-material/Pets';
import TvIcon from '@mui/icons-material/Tv';
import CloudIcon from '@mui/icons-material/Cloud';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import Box from '@mui/material/Box';

const interactions = [
    {
        character: 'Waitress',
        interactions: [
            {
                action: 'Order',
                options: [
                    {
                        name: 'Food',
                        icon: <FastfoodIcon />,
                    },
                    {
                        name: 'Drink',
                        icon: <SportsBarIcon />,
                    },
                ]
            },
            {
                action: 'Ask',
                options: [
                    {
                        name: 'Bill',
                        icon: <AttachMoneyIcon />,
                    },
                    {
                        name: 'Bathroom',
                        icon: <WcIcon />,
                    },
                    {
                        name: 'Employees Bathroom key',
                        icon: <KeyIcon />,
                    },
                ]
            },
            {
                action: 'Compliment',
                options: [
                    {
                        name: 'Service',
                        icon: <LocalDiningIcon />,
                    },
                    {
                        name: 'Waitress',
                        icon: <WomanIcon />,
                    },
                    {
                        name: 'Restaurant',
                        icon: <RestaurantIcon />,
                    },
                    {
                        name: 'Food',
                        icon: <SetMealIcon />,
                    },
                ]
            },
            {
                action: 'Complain about',
                options: [
                    {
                        name: 'Service',
                        icon: <LocalDiningIcon />,
                    },
                    {
                        name: 'Waitress',
                        icon: <WomanIcon />,
                    },
                    {
                        name: 'Restaurant',
                        icon: <RestaurantIcon />,
                    },
                    {
                        name: 'Food',
                        icon: <SetMealIcon />,
                    },
                ]
            }
        ]
    },
    {
        character: 'Friend',
        interactions: [
            {
                action: 'Ask',
                options: [
                    {
                        name: 'To pay for the dinner',
                        icon: <AttachMoneyIcon />,
                    },
                    {
                        name: 'To give the waitress a good tip',
                        icon: <MonetizationOnIcon />,
                    },
                ]
            },
            {
                action: 'Talk about',
                options: [
                    {
                        name: 'Boats',
                        icon: <DirectionsBoatIcon />,
                    },
                    {
                        name: 'Cars',
                        icon: <DirectionsCarIcon />,
                    },
                    {
                        name: 'Photography',
                        icon: <PhotoCameraIcon />,
                    },
                    {
                        name: 'Computers',
                        icon: <ComputerIcon />,
                    },
                    {
                        name: 'Pets',
                        icon: <PetsIcon />,
                    },
                    {
                        name: 'Tv',
                        icon: <TvIcon />,
                    },
                    {
                        name: 'Weather',
                        icon: <CloudIcon />,
                    },
                    {
                        name: 'Food',
                        icon: <FastfoodIcon />,
                    },
                    {
                        name: 'Drink',
                        icon: <SportsBarIcon />,
                    },
                ]
            },
            {
                action: 'Compliment',
                options: [
                    {
                        name: 'Intelligence',
                        icon: <PsychologyIcon />,
                    },
                    {
                        name: 'Appearance',
                        icon: <FaceRetouchingNaturalIcon />,
                    },
                    {
                        name: 'Personality',
                        icon: <EmojiEmotionsIcon />,
                    },
                ]
            },
        ]
    }
]

export function SelectAction() {

    return <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <List
            subheader={
                <ListSubheader>
                    Next Action
                </ListSubheader>
            }
        >
            {
                interactions.map( i => <ExpandableElement key={i.character} action={i.character}>
                    {i.interactions.map(interactionGroup => <ExpandableList key={interactionGroup.action} {...interactionGroup}/>)}
                </ExpandableElement>)
            }
        </List>
    </Box>;
}