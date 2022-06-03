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

import { PlayerAction } from '../gameStateSlice';

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
                        playerAction: 'waitress:order:food' as PlayerAction,
                    },
                    {
                        name: 'Drink',
                        icon: <SportsBarIcon />,
                        playerAction: 'waitress:order:drink' as PlayerAction,
                    },
                ]
            },
            {
                action: 'Ask',
                options: [
                    {
                        name: 'Bill',
                        icon: <AttachMoneyIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Bathroom',
                        icon: <WcIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Employees Bathroom key',
                        icon: <KeyIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                ]
            },
            {
                action: 'Compliment',
                options: [
                    {
                        name: 'Service',
                        icon: <LocalDiningIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Waitress',
                        icon: <WomanIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Restaurant',
                        icon: <RestaurantIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Food',
                        icon: <SetMealIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                ]
            },
            {
                action: 'Complain about',
                options: [
                    {
                        name: 'Service',
                        icon: <LocalDiningIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Waitress',
                        icon: <WomanIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Restaurant',
                        icon: <RestaurantIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Food',
                        icon: <SetMealIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
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
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'To give the waitress a good tip',
                        icon: <MonetizationOnIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                ]
            },
            {
                action: 'Talk about',
                options: [
                    {
                        name: 'Boats',
                        icon: <DirectionsBoatIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Cars',
                        icon: <DirectionsCarIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Photography',
                        icon: <PhotoCameraIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Computers',
                        icon: <ComputerIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Pets',
                        icon: <PetsIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Tv',
                        icon: <TvIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Weather',
                        icon: <CloudIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Food',
                        icon: <FastfoodIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Drink',
                        icon: <SportsBarIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                ]
            },
            {
                action: 'Compliment',
                options: [
                    {
                        name: 'Intelligence',
                        icon: <PsychologyIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Appearance',
                        icon: <FaceRetouchingNaturalIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                    {
                        name: 'Personality',
                        icon: <EmojiEmotionsIcon />,
                        playerAction: 'NOT_IMPLEMENTED' as PlayerAction,
                    },
                ]
            },
        ]
    }
]

export function SelectAction() {



    return <Box sx={{ bgcolor: 'background.paper' }}>
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