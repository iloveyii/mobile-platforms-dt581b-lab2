import React from 'react';
import {AppBar, Toolbar, IconButton, Typography, Button, makeStyles} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from "./Drawer";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default props => {
    const classes = useStyles();

    const [state, setState] = React.useState({
        open: false,
    });

    const toggleDrawer = (open) => (event) => {
        console.log('toggleDrawer ', open)
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({open});
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton onClick={toggleDrawer(true)} edge="start" className={classes.menuButton} color="inherit"
                                aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            <Drawer toggleDrawer={toggleDrawer} state={state}/>
        </>
    )
}
