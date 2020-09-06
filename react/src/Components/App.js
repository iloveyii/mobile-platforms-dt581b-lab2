import React from 'react';
import {Header, Footer} from '../Layouts';
import Temperature from '../Temperature';


class App extends React.Component {
    render() {
        return (
            <>
                <Header/>
                <h1>My React App</h1>
                <Temperature/>
                <Footer/>
            </>
        )
    }
}

export default App;
