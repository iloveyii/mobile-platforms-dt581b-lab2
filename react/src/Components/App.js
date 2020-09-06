import React from 'react';
import {Header, Footer} from '../Layouts';


class App extends React.Component {
    render() {
        return (
            <>
                <Header/>
                <h1>My React App</h1>
                <Footer/>
            </>
        )
    }
}

export default App;
