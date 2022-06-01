import React from 'react'

import { Presentation } from './presentation/Presentation';
import { SelectAction } from './selectAction/SelectAction';
import { ShowText } from './showText/ShowText';
import { TestOpenAiToken } from './testOpenAiToken/TestOpenAiToken';

import { useAppSelector } from './hooks'
import { selectScreen } from './appStateSlice';

import Box from '@mui/material/Box';

export function App() {

    const currentScreen = useAppSelector(selectScreen);
    let currentScreenComponent = <></>;
    switch (currentScreen) {
        case 'presentation':
            currentScreenComponent = <Presentation />;
            break;
        case 'selectAction':
            currentScreenComponent = <SelectAction />;
            break;
        case 'showText':
            currentScreenComponent = <ShowText />;
            break;
        case 'testOpenAiToken':
            currentScreenComponent = <TestOpenAiToken />;
            break;
    }

    return <Box sx={{ padding: '1rem', bgcolor: 'background.paper' }}>
        {currentScreenComponent}
    </Box>;
}