import React from 'react';
import {Paper, Tabs, Tab} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PhoneIcon from '@material-ui/icons/Phone';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import {makeStyles} from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";


const useStyles = makeStyles({
    root: {
        position: 'fixed',
        bottom: 0,
        width: '100%'
    },
    paper: {
        flexGrow: 1,
    },
});

export default props => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>

            <Paper square className={classes.paper}>
                <Tabs
                    value={0}
                    onChange={() => null}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="icon tabs example"
                    centered
                >
                    <Tab icon={<PhoneIcon/>} aria-label="phone"/>
                    <Tab icon={<FavoriteIcon/>} aria-label="favorite"/>
                    <Tab icon={<PersonPinIcon/>} aria-label="person"/>
                </Tabs>
            </Paper>
        </Box>
    )
}
