import React from 'react'
import { Presentation } from './presentation/Presentation';
import { SelectAction } from './selectAction/SelectAction';

export function App() {

    const [currentScreen, setScreen] = React.useState('presentation');

    const handleClick = () => {
        setScreen('selectAction');
    };

    return <>
        {
            currentScreen === 'presentation' ? <Presentation advance={handleClick} /> : <SelectAction />
        }
    </>;
}