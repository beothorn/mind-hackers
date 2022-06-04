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
                        playerAction: 'waitress:ask:bill' as PlayerAction,
                    },
                    {
                        name: 'Bathroom',
                        icon: <WcIcon />,
                        playerAction: 'waitress:ask:bathroom' as PlayerAction,
                    },
                    {
                        name: 'Employees Bathroom key',
                        icon: <KeyIcon />,
                        playerAction: 'waitress:ask:employeeBathroom' as PlayerAction,
                    },
                ]
            },
            {
                action: 'Compliment',
                options: [
                    {
                        name: 'Service',
                        icon: <LocalDiningIcon />,
                        playerAction: 'waitress:compliment:service' as PlayerAction,
                    },
                    {
                        name: 'Waitress',
                        icon: <WomanIcon />,
                        playerAction: 'waitress:compliment:waitress' as PlayerAction,
                    },
                    {
                        name: 'Restaurant',
                        icon: <RestaurantIcon />,
                        playerAction: 'waitress:compliment:restaurant' as PlayerAction,
                    },
                    {
                        name: 'Food',
                        icon: <SetMealIcon />,
                        playerAction: 'waitress:compliment:food' as PlayerAction,
                    },
                ]
            },
            {
                action: 'Complain about',
                options: [
                    {
                        name: 'Service',
                        icon: <LocalDiningIcon />,
                        playerAction: 'waitress:complain:service' as PlayerAction,
                    },
                    {
                        name: 'Waitress',
                        icon: <WomanIcon />,
                        playerAction: 'waitress:complain:waitress' as PlayerAction,
                    },
                    {
                        name: 'Restaurant',
                        icon: <RestaurantIcon />,
                        playerAction: 'waitress:complain:restaurant' as PlayerAction,
                    },
                    {
                        name: 'Food',
                        icon: <SetMealIcon />,
                        playerAction: 'waitress:complain:food' as PlayerAction,
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
                        playerAction: 'friend:ask:payForDinner' as PlayerAction,
                    },
                    {
                        name: 'To give the waitress a good tip',
                        icon: <MonetizationOnIcon />,
                        playerAction: 'friend:ask:giveGoodTip' as PlayerAction,
                    },
                ]
            },
            {
                action: 'Talk about',
                options: [
                    {
                        name: 'Boats',
                        icon: <DirectionsBoatIcon />,
                        playerAction: 'friend:talk:boats' as PlayerAction,
                    },
                    {
                        name: 'Cars',
                        icon: <DirectionsCarIcon />,
                        playerAction: 'friend:talk:cars' as PlayerAction,
                    },
                    {
                        name: 'Photography',
                        icon: <PhotoCameraIcon />,
                        playerAction: 'friend:talk:photography' as PlayerAction,
                    },
                    {
                        name: 'Computers',
                        icon: <ComputerIcon />,
                        playerAction: 'friend:talk:computers' as PlayerAction,
                    },
                    {
                        name: 'Pets',
                        icon: <PetsIcon />,
                        playerAction: 'friend:talk:pets' as PlayerAction,
                    },
                    {
                        name: 'Tv',
                        icon: <TvIcon />,
                        playerAction: 'friend:talk:tv' as PlayerAction,
                    },
                    {
                        name: 'Weather',
                        icon: <CloudIcon />,
                        playerAction: 'friend:talk:weather' as PlayerAction,
                    },
                    {
                        name: 'Food',
                        icon: <FastfoodIcon />,
                        playerAction: 'friend:talk:food' as PlayerAction,
                    },
                    {
                        name: 'Drink',
                        icon: <SportsBarIcon />,
                        playerAction: 'friend:talk:drink' as PlayerAction,
                    },
                ]
            },
            {
                action: 'Compliment',
                options: [
                    {
                        name: 'Intelligence',
                        icon: <PsychologyIcon />,
                        playerAction: 'friend:compliment:intelligence' as PlayerAction,
                    },
                    {
                        name: 'Appearance',
                        icon: <FaceRetouchingNaturalIcon />,
                        playerAction: 'friend:compliment:appearance' as PlayerAction,
                    },
                    {
                        name: 'Personality',
                        icon: <EmojiEmotionsIcon />,
                        playerAction: 'friend:compliment:personality' as PlayerAction,
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