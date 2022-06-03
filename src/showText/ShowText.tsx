import React from 'react';

import { batch } from 'react-redux'

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from '../hooks'
import { actionSetScreen } from '../appStateSlice';
import { selectLastText, actionSetLastText } from '../gameStateSlice';

export function ShowText() {
    const lastText = useAppSelector(selectLastText);
    const dispatch = useAppDispatch()

    const gotoNextScreen = () => batch(() => {
        dispatch(actionSetLastText('Loading...'));
        dispatch(actionSetScreen('selectAction'));
    });

    return <>
        {lastText === '' ? 'Ackward silence...' : lastText.split('\n').map((line, i) => 
            <Typography variant="body1" gutterBottom key={i}>{line}</Typography>
        )}
        <Typography sx={{marginBottom: '1rem'}} variant="body1" gutterBottom>
        </Typography>
        <Button sx={{marginLeft: 1}} variant="contained" onClick={gotoNextScreen}>Continue</Button>
    </>;
}