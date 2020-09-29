import React from 'react';
import {Grid} from "@material-ui/core";
import Left from './Left';
import Right from './Right';
import {temperatures} from "../../constants/mock";


const api = 'http://34.203.242.6:5000/api/v1/temperatures';
const clearUnit = {
    unit_id: '',
    temperature: '',
    timestamp: ''
};

const REFRESH_THRESHOLD = 60; // Seconds - 60

class Temperature extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temperatures,
            average: '',
            activeUnit: clearUnit,
            timer: 0
        };
        this.startTimer();
    }

    startTimer = () => {
      setInterval(() => {
        let {timer} = this.state;
        if(timer > REFRESH_THRESHOLD) {
          timer = 0;
          this.fetchData();
        }
        this.setState({timer: timer+1});
      }, 1000);
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
                  window.data = response.data;
                  const data = response.data.slice(0,5);
                  let sum = 0;
                  data.map( d => sum += Number(d.temperature) );
                  let average =   sum/ data.length;
                  this.setState({temperatures: response.data, average})
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
                    if(method === 'POST') {
                      clearUnit.status = 'create.success';
                    } else {
                      clearUnit.status = 'update.success';
                    }
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
                    clearUnit.status = 'delete.success';
                    this.setState({activeUnit: clearUnit});
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
            return 'update.success';
        } else {
            activeUnit.timestamp = Date.now();
            temperatures.push(activeUnit);
            this.saveData(activeUnit, 'POST');
            return 'create.success';
        }
    };

    deleteActiveUnit = activeUnit => {
        let {temperatures} = this.state;
        temperatures = temperatures.filter(unit => unit.unit_id !== activeUnit.unit_id);
        this.deleteUnit(activeUnit);
        this.setState({
            temperatures, activeUnit: clearUnit
        });
        console.log(temperatures);
        return 'delete.success';
    };

    render() {
        let timer = REFRESH_THRESHOLD - this.state.timer;
        if (timer < 0) timer = 0;

        return (
            <Grid container>
                <Grid item sm xs={12}>
                    <Left setActiveUnit={this.setActiveUnit} temperatures={this.state.temperatures}/>
                    <h4>Average : {this.state.average}</h4>
                    <p>Refreshing in  { timer }</p>
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
