import React from 'react';
import ReactDOM from 'react-dom';
import './styling/index.css';
import Login from './Login';

//Tells the app to open the App.js 

ReactDOM.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
  document.getElementById('root')
);
