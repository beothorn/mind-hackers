import React from 'react'
import { Presentation } from './presentation/Presentation';
import { SelectAction } from './selectAction/SelectAction';
import { ShowText } from './showText/ShowText';

export function App() {

    const [currentScreen, setScreen] = React.useState({
        screen: 'presentation',
        key: ''
    });

    const gotoShowText = (openAiKey: string) => { setScreen({
        screen: 'showText',
        key: openAiKey
    }); };
    const gotoSelectAction = (openAiKey: string) => { setScreen({
        screen: 'selectAction',
        key: openAiKey
    }); };

    switch (currentScreen.screen) {
        case 'presentation':
            return <Presentation advance={gotoShowText} />;
        case 'selectAction':
            return <SelectAction />;
        case 'showText':
            return <ShowText openAiKey={currentScreen.key} advance={gotoSelectAction}/>;
        default:
            return <></>;
    }
}