import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { useAppSelector, useAppDispatch } from '../hooks'
import { selectOpenAiKey } from '../appStateSlice';
import type { AppScreen } from '../appStateSlice';

export function ShowText() {
    const openAiKey = useAppSelector(selectOpenAiKey);
    const dispatch = useAppDispatch()

    const [data, setData] = useState('Loading...');

    const gotoNextScreen = () => dispatch({type: 'appState/setScreen', payload: ('selectAction' as AppScreen)});

    const dinnerIntro = `You were invited to dinner by your friend Jonas. The restaurant is small but looks nice.
You really need to go to the bathroom. You also realised that you forgot to bring your wallet.
You start a conversation with Jonas, but avoid telling him about your wallet. You are not good with smalltalk, so you ask him about the restaurant.`;

    useEffect(() => {
        const genDinnerIntro = async () => {
            const result: any = await axios.post('https://api.openai.com/v1/engines/text-davinci-002/completions', {
                "prompt": dinnerIntro,
                "max_tokens": 256,
                "temperature": 0.9,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0,
            }, {
                headers: {
                  'Authorization': `Bearer ${openAiKey}`,
                  'Content-Type': 'application/json'
                }
              });
            setData(result.data.choices[0].text);
        };

        genDinnerIntro();
    }, [openAiKey]);

    return <Box sx={{ padding: '1rem', bgcolor: 'background.paper' }}>
        {
            data === 'Loading...' ? <></> : <>
                <Typography variant="body1" gutterBottom>
                    {dinnerIntro}
                </Typography>
            </>
        }
        
        <Typography variant="body1" gutterBottom>
            {data === '' ? 'Ackward silence...' : data}
        </Typography>
        <Button sx={{marginLeft: 1}} variant="contained" onClick={gotoNextScreen}>Continue</Button>
    </Box>;
}