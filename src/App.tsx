import React from 'react'

import { Presentation } from './presentation/Presentation';
import { SelectAction } from './selectAction/SelectAction';
import { ShowText } from './showText/ShowText';

import { useAppSelector } from './hooks'
import { selectScreen } from './appStateSlice';

export function App() {

    const currentScreen = useAppSelector(selectScreen);

    switch (currentScreen) {
        case 'presentation':
            return <Presentation />;
        case 'selectAction':
            return <SelectAction />;
        case 'showText':
            return <ShowText />;
        default:
            return <></>;
    }
}