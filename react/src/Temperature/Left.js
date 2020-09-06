import React from 'react';
import {Paper, Box, makeStyles} from "@material-ui/core";
import Table from './Table';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(5),
    },
}));


export default props => {
    const classes = useStyles();
    return (
        <Box m={3} p={5}>
            <Paper className={classes.paper}>
                <Table />
            </Paper>
        </Box>
    )
}
