import React from 'react';
import {Grid} from "@material-ui/core";
import Left from './Left';
import Right from './Right';
import {temperatures} from "../../constants/mock";


const api = 'http://localhost:6600/api/v1/temperatures';

class Temperature extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temperatures,
            activeUnit: {
                unit_id: '',
                temperature: '',
                timestamp: ''
            }
        }
    }

    fetchData = () => {
        fetch(api)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                if (data.success) {
                    this.setState({temperatures: data.data})
                }
            })
            .catch(error => {
                console.log('Error in fetch ', error);
            })
    };

    saveData = (unit, method) => {
        fetch(api + (method === 'PUT' ? '/' + unit.id : ''), {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({unit})
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                if (data.success) {
                    console.log('Saved')
                }
            })
            .catch(error => {
                console.log('Error in fetch ', error);
            })
    };

    deleteUnit = (unit) => {
        fetch(api + '/' + unit.id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                if (data.success) {
                    console.log('Deleted')
                }
            })
            .catch(error => {
                console.log('Error in fetch ', error);
            })
    };

    componentDidMount() {
        this.fetchData();
    }

    setActiveUnit = activeUnit => {
        this.setState({activeUnit})
        console.log(activeUnit)
    };

    updateActiveUnit = activeUnit => {
        const {temperatures} = this.state;
        const index = temperatures.findIndex(unit => unit.unit_id === activeUnit.unit_id);
        if (activeUnit.temperature < -3 || activeUnit.temperature > 3) activeUnit.temperature = 0;
        if (index !== -1) {
            temperatures[index] = activeUnit;
            this.saveData(activeUnit, 'PUT');
        } else {
            activeUnit.timestamp = Date.now();
            temperatures.push(activeUnit);
            this.saveData(activeUnit, 'POST');
        }
        activeUnit = {
            unit_id: '',
            temperature: '',
            timestamp: ''
        };
        this.setState({temperatures, activeUnit})
    };

    deleteActiveUnit = activeUnit => {
        let {temperatures} = this.state;
        temperatures = temperatures.filter(unit => unit.unit_id !== activeUnit.unit_id);
        this.deleteUnit(activeUnit);
        this.setState({
            temperatures, activeUnit: {
                unit_id: '',
                temperature: '',
                timestamp: ''
            }
        });
        console.log(temperatures)
    };

    render() {
        return (
            <Grid container>
                <Grid item sm xs={12}>
                    <Left setActiveUnit={this.setActiveUnit} temperatures={this.state.temperatures}/>
                </Grid>
                <Grid item sm xs={12}>
                    <Right deleteActiveUnit={this.deleteActiveUnit} updateActiveUnit={this.updateActiveUnit}
                           activeUnit={this.state.activeUnit}/>
                </Grid>
            </Grid>
        )
    }
}

export default Temperature;
