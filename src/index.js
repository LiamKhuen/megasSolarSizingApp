import React from 'react'; //---Took out { Component } from import since unused
import ReactDOM from 'react-dom';
// for main app
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
