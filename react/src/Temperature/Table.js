import React from 'react';
import {Paper, Box, makeStyles, Typography, withStyles} from "@material-ui/core";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";


const styles = {
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: 5,
    },
    tableCell: {
        cursor: 'pointer'
    }
};


class TableComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temperatures: [],
            sorting: {
                unit_id: 1,
                temperature: 1,
                timestamp: 1
            }
        }
    }

    componentDidMount() {
        const {temperatures} = this.props;
        this.setState({temperatures});
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('componentWillReceiveProps', nextProps.temperatures)
        const {temperatures} = nextProps;
        this.setState({temperatures});
    }

    handleClick = e => {
        e.preventDefault();
        console.log('clicked', e.target.id);
        let {temperatures, sorting} = this.state;
        temperatures.sort((a, b) => {
            let compare = 0;
            if (a[e.target.id] > b[e.target.id]) compare = -1;
            if (a[e.target.id] < b[e.target.id]) compare = 1;
            return compare * sorting[e.target.id];
        });
        sorting[e.target.id] = sorting[e.target.id] * -1;
        this.setState({temperatures, sorting});
    };

    render() {
        const {temperatures} = this.state;

        return (
            <TableContainer component={Paper}>
                <Table style={styles.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={styles.tableCell}>#</TableCell>
                            <TableCell style={styles.tableCell} align="right">
                                <Typography id="unit_id" onClick={this.handleClick}
                                            variant="h6">Unit
                                    ID {this.state.sorting.unit_id > 0 ? '' : '-'} </Typography>
                            </TableCell>
                            <TableCell style={styles.tableCell} align="right">
                                <Typography id="temperature" onClick={this.handleClick}
                                            variant="h6">Temp {this.state.sorting.temperature > 0 ? '' : '-'}</Typography>
                            </TableCell>
                            <TableCell style={styles.tableCell} align="right">
                                <Typography id="timestamp" onClick={this.handleClick}
                                            variant="h6">Timestamp {this.state.sorting.timestamp > 0 ? '' : '-'}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {temperatures.map((row, i) => (
                            <TableRow key={i + 1} onClick={() => this.props.setActiveUnit(row)}>
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
}

export default TableComponent;
