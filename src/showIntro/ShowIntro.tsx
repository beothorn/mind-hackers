import React, { useEffect } from 'react';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from '../hooks'
import { selectOpenAiKey, actionSetScreen } from '../appStateSlice';
import { selectRestaurantDescription, selectRestaurantType, dispatchActionQueryRestaurantDescription } from '../gameStateSlice';

export function ShowIntro() {
    const openAiKey = useAppSelector(selectOpenAiKey);
    const restaurantDescription = useAppSelector(selectRestaurantDescription);
    const restaurantType = useAppSelector(selectRestaurantType);
    
    const dispatch = useAppDispatch()
    const gotoNextScreen = () => dispatch(actionSetScreen('selectAction'));

    useEffect(() => {
        dispatchActionQueryRestaurantDescription(dispatch, openAiKey, restaurantType);
    }, [openAiKey]);

    return <>
        {
            restaurantDescription === 'Loading...' ? <></> : <>
                <Typography variant="h6" gutterBottom>
                    The dinner
                </Typography>
                <Typography variant="body1" gutterBottom>
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