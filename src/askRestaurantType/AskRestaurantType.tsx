import React from 'react';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useAppDispatch } from '../hooks'
import { actionSetScreen } from '../appStateSlice';
import { actionSetRestaurantType } from '../gameStateSlice';

import TextField from '@mui/material/TextField';
import { batch } from 'react-redux';

export function AskRestaurantType() {

    const [restaurantType, setRestaurantType] = React.useState('italian');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRestaurantType(event.target.value);
    };

    const dispatch = useAppDispatch()

    const callback = () => {
        batch(() => {
            dispatch(actionSetRestaurantType(restaurantType));
            dispatch(actionSetScreen('showIntro'));
        })
    }

    return <>
        <Typography variant="h6" gutterBottom>
            Prologue
        </Typography>
        <Typography variant="body1" gutterBottom>
            A long time ago you found a magic ring that give you the ability to insert thoughts into the other persons head.
            <br />
            Unfortunately it only works when the person trusts you.
        </Typography>
        <Typography variant="h6" gutterBottom>
            The dinner
        </Typography>
        <Typography variant="body1" gutterBottom>
            You invited your friend Jonas to dinner.
        </Typography>
        <Typography variant="body1" gutterBottom>
            To what kind of restaurant you invited him? (chinese, italian, etc..)
        </Typography>
        <TextField 
            value={restaurantType}
            onChange={handleChange}
            required size="small" 
            id="input-key" 
            label="" 
            variant="outlined" 
        />
        <Button sx={{marginLeft: 1}} variant="contained" onClick={callback}>Continue</Button>
    </>;
}