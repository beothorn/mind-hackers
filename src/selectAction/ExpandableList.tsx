import React from 'react'
import { batch } from 'react-redux';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ListItemIcon from '@mui/material/ListItemIcon';

import { useAppSelector, useAppDispatch } from '../hooks';
import { actionSetScreen } from '../appStateSlice';
import { actionSetNextPlayerAction } from '../gameStateSlice';
import { PlayerAction } from '../PlayerActions';

type Option = {
    name: string,
    icon: any,
    playerAction: PlayerAction,
    condition?: (useAppSelector: any) => boolean,
}

export function ExpandableList({action, options}: {action: string, options: Option[]}) {

    const dispatch = useAppDispatch()

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    const handleOptionClick = (playerAction: PlayerAction) => {
        batch(() => {
            dispatch(actionSetNextPlayerAction(playerAction));
            dispatch(actionSetScreen('insertThought'));
        })
    }

    //if option has no condition then it is true, else is the value of the condition
    let optionsAvailableCount = 0;
    for(const o of options) {
        if(o.condition === undefined) {
            optionsAvailableCount++;
        }else{
            if(o.condition(useAppSelector)) {
                optionsAvailableCount++;
            }
        }
    }

    if(optionsAvailableCount === 0) return <></>;

    return <List>
        <ListItemButton key={action+'button'} sx={{ pl: 8 }} onClick={handleClick}>
            <ListItemText primary={action} />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse key={action+'collapse'} in={open} timeout="auto" unmountOnExit>
            <List>
                {
                    options.map( o => 
                        o.condition && !o.condition(useAppSelector) ? <></>:
                        <ListItemButton 
                            onClick={() => handleOptionClick(o.playerAction)}  
                            key={action+o.name} 
                            sx={{ pl: 12 }}
                        >
                            <ListItemIcon>
                                {o.icon}
                            </ListItemIcon>
                            <ListItemText primary={o.name} />
                        </ListItemButton>)
                }
            </List>
        </Collapse>
  </List>;
}
  