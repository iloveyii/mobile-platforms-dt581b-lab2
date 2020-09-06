import React from 'react';
import {Box, Paper,makeStyles} from "@material-ui/core";

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
            <Paper className={classes.paper}>Right</Paper>
        </Box>
    )
}
