import React from 'react';
import {Paper, Box, makeStyles, Typography} from "@material-ui/core";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {temperatures} from "../constants/mock";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(5),
    },
    tableCell: {
        cursor: 'pointer'
    }
}));

const handleClick = e => {
    e.preventDefault();
    console.log('clicked', e.target.id);
    temperatures.sort((a, b) => {
        let compare = 0;
        if (a[e.target.id] > b[e.target.id]) compare = -1;
        if (a[e.target.id] < b[e.target.id]) compare = 1;
        return compare;
    });
    console.log(temperatures)
};

export default props => {
    const classes = useStyles();
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableCell}>#</TableCell>
                        <TableCell className={classes.tableCell} align="right">
                            <Typography id="unit_id" onClick={handleClick} variant="h6">Unit ID</Typography>
                        </TableCell>
                        <TableCell className={classes.tableCell} align="right">
                            <Typography id="temperature" onClick={handleClick} variant="h6">Temp</Typography>
                        </TableCell>
                        <TableCell className={classes.tableCell} align="right">
                            <Typography id="timestamp" onClick={handleClick} variant="h6">Timestamp</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {temperatures.map((row, i) => (
                        <TableRow key={i + 1}>
                            <TableCell component="th" scope="row">
                                {i + 1}
                            </TableCell>
                            <TableCell align="right"> {row.unit_id}</TableCell>
                            <TableCell align="right">{row.temperature}</TableCell>
                            <TableCell align="right">{row.timestamp}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
