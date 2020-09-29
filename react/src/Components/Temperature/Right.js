import React from 'react';
import {Box, Paper, makeStyles, TextField, Button} from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = {
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: 10,
    },
    buttonDel: {
        float: 'right'
    }
};

class Right extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeUnit: {
                unit_id: '',
                temperature: '',
                timestamp: ''
            }
        }
    }

    componentDidMount() {
        const {activeUnit} = this.props;
        this.setState({activeUnit});
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {activeUnit} = nextProps;
        this.setState({activeUnit});
    }

    handleChange = e => {
        console.log(e.target.id);
        const {activeUnit} = this.state;
        activeUnit[e.target.id] = e.target.value;
        this.setState({activeUnit});
    };

    deleteUnit = e => {
      e.preventDefault();
      let {activeUnit} = this.state;
      const status = this.props.deleteActiveUnit(activeUnit);
      activeUnit = {
          unit_id: '',
          temperature: '',
          timestamp: ''
      };

      if(status === 'delete.success') {
        activeUnit.status = 'Deleted successfully';
      }
      setTimeout(() => {
        console.log('Right');
        this.setState({activeUnit});
      },2000);
    }

    save = e => {
      e.preventDefault();
      let {activeUnit} = this.state;
      const status = this.props.updateActiveUnit(activeUnit);
      activeUnit = {
          unit_id: '',
          temperature: '',
          timestamp: ''
      };
      if(status === 'update.success') {
        activeUnit.status = 'Updated successfully';
      }
      if(status === 'create.success') {
        activeUnit.status = 'Created successfully';
      }
      setTimeout(() => {
        console.log('Right');
        this.setState({activeUnit});
      }, 2000);
    };

    render() {
        const {activeUnit} = this.state;
        return (
            <Box m={3} p={5}>
                <Paper style={styles.paper}>
                    <div style={styles.root} noValidate autoComplete="off">
                        <TextField id="unit_id" onChange={this.handleChange} required label="Unit ID"
                                   value={activeUnit.unit_id}/>
                        <TextField
                            id="temperature"
                            label="Temp"
                            type="number"
                            InputProps={{
                                inputProps: {
                                    max: 3, min: -3
                                }
                            }}
                            value={activeUnit.temperature}
                            onChange={this.handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <Box mt={5}>
                            <Button
                                onClick={this.save }
                                mt={5}
                                variant="contained"
                                color="primary"
                                style={styles.button}
                                startIcon={<SaveIcon/>}
                            >
                                Save
                            </Button>

                            <Button
                                onClick={this.deleteUnit}
                                variant="contained"
                                mt={5}
                                color="secondary"
                                style={styles.buttonDel}
                                startIcon={<DeleteIcon />}
                            >
                                Delete
                            </Button>
                        </Box>

                    </div>
                </Paper>

                <Box mt={3}>
                  <p>{this.state.activeUnit.status && ( ! ['delete.success', 'create.success', 'update.success'].includes(this.state.activeUnit.status) ) ? this.state.activeUnit.status : ''}</p>
                </Box>
            </Box>
        )
    }
}

export default Right;
