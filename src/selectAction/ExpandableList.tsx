import React from 'react'
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ListItemIcon from '@mui/material/ListItemIcon';


export function ExpandableList({action, options}: {action: string, options: any[]}) {

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return <List>
        <ListItemButton sx={{ pl: 8 }} onClick={handleClick}>
            <ListItemText primary={action} />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List>
                {
                    options.map( o => <ListItemButton key={action+o.name} sx={{ pl: 12 }}>
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
  