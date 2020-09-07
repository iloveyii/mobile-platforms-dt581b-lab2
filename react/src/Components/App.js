import React from 'react';
import {Header, Footer} from '../Layouts';
import Temperature from './Temperature';
import {Typography} from "@material-ui/core";


class App extends React.Component {
    render() {
        return (
            <>
                <Header/>
                <Typography style={{textAlign: 'center', marginTop: '10px'}} variant='h4'>
                    Temperature Units
                </Typography>
                <Temperature/>
                <Footer/>
            </>
        )
    }
}

export default App;
