import React from 'react';
import {Paper, Box} from "@material-ui/core";
import Table from './Table';
import {temperatures} from "../../constants/mock";

const styles = {
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: 10,
    },
};


class Left extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temperatures: []
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

    render() {
        const {temperatures } = this.props;

        return (
            <Box m={3} p={5}>
                <Paper style={styles.paper}>
                    <Table count={temperatures.length} setActiveUnit={this.props.setActiveUnit} temperatures={temperatures}/>
                </Paper>
            </Box>
        )
    }
}

export default Left;
