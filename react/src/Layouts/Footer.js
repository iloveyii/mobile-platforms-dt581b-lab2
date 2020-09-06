import React from 'react';
import {Paper, Tabs, Tab} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PhoneIcon from '@material-ui/icons/Phone';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        maxWidth: '100%',
        position: 'fixed',
        bottom: 0
    },
});

export default props => {
    const classes = useStyles();

    return(
        <Paper square className={classes.root}>
            <Tabs
                value={0}
                onChange={()=>null}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                aria-label="icon tabs example"
            >
                <Tab icon={<PhoneIcon />} aria-label="phone" />
                <Tab icon={<FavoriteIcon />} aria-label="favorite" />
                <Tab icon={<PersonPinIcon />} aria-label="person" />
            </Tabs>
        </Paper>
    )
}
