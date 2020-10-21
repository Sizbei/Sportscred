import React from 'react';
import ReactDOM from 'react-dom';
import './styling/index.css';
import MasterRouter from './MasterRouter';
import AuthProvider from './Context/AuthContext';
//Tells the app to open the App.js 
  
ReactDOM.render(
  <AuthProvider>
    <React.StrictMode>
      <MasterRouter />
    </React.StrictMode>
  </AuthProvider>,
  document.getElementById('root')
);