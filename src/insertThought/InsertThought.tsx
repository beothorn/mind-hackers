import React from 'react';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from '../hooks'
import { actionSetScreen } from '../appStateSlice';
import { selectOpenAiKey } from '../appStateSlice';

import { dispatchPlayerAction, selectGameState, selectNextPlayerAction } from '../gameStateSlice';

import TextField from '@mui/material/TextField';
import { batch } from 'react-redux';

export function InsertThought() {

    const [thought, setThought] = React.useState('');

    const openAiKey = useAppSelector(selectOpenAiKey);
    const gameState = useAppSelector(selectGameState);
    const playerAction = useAppSelector(selectNextPlayerAction);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setThought(event.target.value);
    };

    const dispatch = useAppDispatch()

    const callback = () => {
        batch(() => {
            dispatchPlayerAction(dispatch, gameState, openAiKey, playerAction, thought);
            dispatch(actionSetScreen('showText'));
        })
    }
    const talkingTo = playerAction.startsWith('waitress') ? 'the waitress' : 'Jonas' ;
    return <>
        <Typography variant="h6" gutterBottom>
            Mind hack 
        </Typography>
        <Typography variant="body1" gutterBottom>
            You can insert a single thought inside the mind of {talkingTo}. Use the first person.
        </Typography>
        <TextField 
            value={thought}
            onChange={handleChange}
            required size="small" 
            id="input-key" 
            label="" 
            variant="outlined" 
        />
        <Button sx={{marginLeft: 1}} variant="contained" onClick={callback}>Continue</Button>
    </>;
}