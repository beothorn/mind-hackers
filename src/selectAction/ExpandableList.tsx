import React from 'react'
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ListItemIcon from '@mui/material/ListItemIcon';

import { useAppSelector, useAppDispatch } from '../hooks'
import { selectOpenAiKey } from '../appStateSlice';
import { PlayerAction, dispatchPlayerAction, selectGameState } from '../gameStateSlice';

type Option = {
    name: string,
    icon: any,
    playerAction: PlayerAction,
}

export function ExpandableList({action, options}: {action: string, options: Option[]}) {

    const openAiKey = useAppSelector(selectOpenAiKey);
    const gameState = useAppSelector(selectGameState);
    const dispatch = useAppDispatch()

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    const handleOptionClick = (playerAction: PlayerAction) => {
        dispatchPlayerAction(dispatch, gameState, openAiKey, playerAction);
    }

    return <List>
        <ListItemButton sx={{ pl: 8 }} onClick={handleClick}>
            <ListItemText primary={action} />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List>
                {
                    options.map( o => <ListItemButton onClick={() => handleOptionClick(o.playerAction)}  key={action+o.name} sx={{ pl: 12 }}>
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
  