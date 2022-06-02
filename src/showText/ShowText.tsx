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
        <Typography sx={{marginBottom: '1rem'}} variant="body1" gutterBottom>
            {lastText === '' ? 'Ackward silence...' : lastText}
        </Typography>
        <Button sx={{marginLeft: 1}} variant="contained" onClick={gotoNextScreen}>Continue</Button>
    </>;
}