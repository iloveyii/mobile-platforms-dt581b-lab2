import React from 'react';
import {Grid} from "@material-ui/core";
import Left from './Left';
import Right from './Right';
import {temperatures} from "../constants/mock";


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

    setActiveUnit = activeUnit => {
        this.setState({activeUnit})
        console.log(activeUnit)
    };
    updateActiveUnit = activeUnit => {
        const {temperatures} = this.state;
        const index = temperatures.findIndex(unit => unit.unit_id === activeUnit.unit_id);
        if (index !== -1) {
            temperatures[index] = activeUnit;
        } else {
            activeUnit.timestamp = Date.now();
            temperatures.push(activeUnit);
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
                    <Right deleteActiveUnit={this.deleteActiveUnit} updateActiveUnit={this.updateActiveUnit} activeUnit={this.state.activeUnit}/>
                </Grid>
            </Grid>
        )
    }
}

export default Temperature;
