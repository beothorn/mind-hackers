import React from 'react'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';

export function Presentation({advance}: {advance: ()=>void}) {
    return <Box sx={{ padding: '1rem' }}>
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    An experiemnt with gpt-3
                </Typography>
                <Typography variant="body1" gutterBottom>
                    A simulation where you are having dinner with a friend.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    There are two goals, get your friend to pay for the dinner (including a good tip) and get a key for the employees only bathroom.
                    There is a fixed list of possible interactions, but you can insert a thought inside the other persons head on each interaction. 
                    The insertion is a sentence of maximum 5 words and will work only sometimes.
                </Typography>
                <Typography variant="body1" >
                    You will need a key for using the gpt-3 api, as the game runs on your browser.
                </Typography>
                <Typography variant="body1">
                    If you don't have one, you can get one  <Link href="https://beta.openai.com/" underline="none">here</Link>.
                </Typography>
            </CardContent>
            <CardActions>
                <TextField required size="small" id="open-ai-key" label="OpenAi key" variant="outlined" />
                <Button sx={{marginLeft: 1}} variant="contained" onClick={advance}>Ok</Button>
            </CardActions>
        </Card>        
    </Box>;
}