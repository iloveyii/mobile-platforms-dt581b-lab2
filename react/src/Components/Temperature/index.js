import React from 'react';
import {Grid} from "@material-ui/core";
import Left from './Left';
import Right from './Right';
import {temperatures} from "../../constants/mock";


const api = 'http://localhost:5000/api/v1/temperatures';
const clearUnit = {
    unit_id: '',
    temperature: '',
    timestamp: ''
};

class Temperature extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temperatures,
            activeUnit: clearUnit
        }
    }

    fetchData = () => {
        fetch(api)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(response => {
                if (response.success) {
                    this.setState({temperatures: response.data})
                }
            })
            .catch(error => {
                console.log('Error in fetch ', error);
            })
    };

    saveData = (form, method) => {
        let id = '';
        form.method = 'POST';
        if (method === 'PUT') {
            id = '/' + (form.id ? form.id : form.unit_id);
            form.method = 'PUT';
        }
        fetch(api + id, {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({form})
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(response => {
                if (response.success) {
                    this.setState({activeUnit: clearUnit});
                    console.log('Saved');
                } else {
                    console.log('Saving ...', response)
                }
            })
            .catch(error => {
                console.log('Error in fetch ', error);
            })
    };

    deleteUnit = (unit) => {
        const id = unit.id ? unit.id : unit.unit_id;
        fetch(api + '/' + id, {
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
                    console.log('Deleted', unit)
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
    };

    deleteActiveUnit = activeUnit => {
        let {temperatures} = this.state;
        temperatures = temperatures.filter(unit => unit.unit_id !== activeUnit.unit_id);
        this.deleteUnit(activeUnit);
        this.setState({
            temperatures, activeUnit: clearUnit
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
