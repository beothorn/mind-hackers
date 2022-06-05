import React, { useEffect } from 'react';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from '../hooks'
import { selectOpenAiKey, actionSetScreen } from '../appStateSlice';
import { selectRestaurantDescription, dispatchActionQueryRestaurantDescription } from '../gameStateSlice';

export function ShowIntro() {
    const openAiKey = useAppSelector(selectOpenAiKey);
    const restaurantDescription = useAppSelector(selectRestaurantDescription);
    
    const dispatch = useAppDispatch()
    const gotoNextScreen = () => dispatch(actionSetScreen('selectAction'));

    useEffect(() => {
        dispatchActionQueryRestaurantDescription(dispatch, openAiKey);
    }, [openAiKey]);

    return <>
        {
            restaurantDescription === 'Loading...' ? <></> : <>
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
                    You were invited to dinner by your friend Jonas.
                    <br />
                    Arriving at the restaurant you notice two things:
                </Typography>
                <Typography variant="body1" gutterBottom>
                    You really need to go to the bathroom. 
                </Typography>
                <Typography variant="body1" gutterBottom>
                    You also realised that you forgot to bring your wallet. You and Jonas arrive at the restaurant.
                </Typography>
                <Typography variant="h6" gutterBottom>
                    The restaurant
                </Typography>
            </>
        }
        
        {restaurantDescription === '' ? 'Loading...' : restaurantDescription.split('\n').map((line, i) => 
            <Typography variant="body1" gutterBottom key={i}>{line}</Typography>
        )}

        <Typography sx={{marginBottom: '1rem'}} variant="body1" gutterBottom>
        </Typography>
        <Button sx={{marginLeft: 1}} variant="contained" onClick={gotoNextScreen}>Continue</Button>
    </>;
}