import React, { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from '../hooks'
import { selectOpenAiKey, actionSetScreen } from '../appStateSlice';

import { getCompletion } from '../OpenAiApi'

export function ShowText() {
    const openAiKey = useAppSelector(selectOpenAiKey);
    const dispatch = useAppDispatch()

    const [data, setData] = useState('Loading...');

    const gotoNextScreen = () => dispatch(actionSetScreen('selectAction'));

    const openAiQuery = `You were invited to dinner by your friend Jonas. The restaurant is small but looks nice. I will try to describe this restaurant:`;

    useEffect(() => {
        const genDinnerIntro = async () => {
            const result: any = await getCompletion(openAiKey, openAiQuery);
            setData(result.data.choices[0].text);
        };

        genDinnerIntro();
    }, [openAiKey]);

    return <>
        {
            data === 'Loading...' ? <></> : <>
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
                    You also realised that you forgot to bring your wallet. You and Jonas arrive at te restaurant.
                </Typography>
                <Typography variant="h6" gutterBottom>
                    The restaurant
                </Typography>
            </>
        }
        
        <Typography variant="body1" gutterBottom>
            {data === '' ? 'Ackward silence...' : data}
        </Typography>
        <Button sx={{marginLeft: 1}} variant="contained" onClick={gotoNextScreen}>Continue</Button>
    </>;
}