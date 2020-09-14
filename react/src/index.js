import '@babel/polyfill';
import React from 'react';
import {render} from 'react-dom';
import App from './Components/App';

// import(/* webpackChunkName : 'app' */ './Components/App')
//     .then(({default: App}) =>
//         render(<App/>, document.getElementById('root'))
//     );

render(<App/>, document.getElementById('root'))
