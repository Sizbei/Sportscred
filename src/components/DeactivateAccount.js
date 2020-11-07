import React, { Component, useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, useHistory} from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';

import '../styling/Settings.css';

export default function Popup() {

  const [formState, setFormState] = useState("button");
  const {register, handleSubmit, watch, errors } = useForm();
  const[verifyOld, setOldState] = useState(null);
  const[verifyNew, setNewState] = useState(null);
  const[verifyConfirm, setConfirmState] = useState(null);

  const[verifyPass, setPassState] = useState(null);

  const authContext = useContext(AuthContext);

  let history = useHistory();

  const logOut = () => {
    console.log("Logging out...");
    AuthService.logout().then((data) => {
    if(data.success){
      authContext.setUser(data.user);
      authContext.setIsAuthenticated(false);
    }
    });
  }


  const confirmForm = data => {
    
    fetch('/settings/account/verifypass/' + authContext.user.username + '/' + data.password).then(res => res.json())
    .then(async res => {
        setPassState(res.verified);
        if(res.verified){
          setFormState("deactivate")
        }
      }
    );

    
  }

  const finalForm = data => {

    const username = authContext.user.username;

    logOut();
    
    fetch('/settings/account/deactivate/' + username, {
      method: 'DELETE',
    })
    .then(res => res.json())
    .then(res => res.json())
    
  }

  if (formState === "button") {
    return <button className="deactivate-button" onClick={() => {setFormState("password")}}>Deactivate Account</button>;

  } else if (formState == "password"){
    return (
      <div>

        <div className='popup-out' onClick={() => setFormState("button")}>

          <div className='popup-in' onClick = {(e) => { e.stopPropagation(); }}>

            <h2 className="settings-h2">Deactivate Account</h2>
            <hr className="settings-hr"></hr>
            
            <form className="form" onSubmit={handleSubmit(confirmForm)}>
              
              <input type="password" name="password" placeholder="CURRENT PASSWORD" autoComplete="off" className="current-password pop-input" ref={register({required: true })} maxLength="30" ></input>
              {(verifyPass == false) ? <span className="warning">Incorrect password</span> : null}
              <input type="submit" className="submit" value="Proceed" /> 
          
            </form>


          </div>

        </div>
      </div>      

    );
  
  } else if (formState === "deactivate") {
    return (
      <div>

        <div className='popup-out' onClick={() => setFormState("button")}>

          <div className='popup-in' onClick = {(e) => { e.stopPropagation(); }}>

            <h2 className="settings-h2">Are you sure you want to deactivate your account?</h2>

            <form className="form" onSubmit={handleSubmit(finalForm)}>
              
              <div className="deactivate-container">
                <input type="submit" className="submit" value="Yes" /> 
                <input type="submit" onClick={() => setFormState("button")} className="submit" value="No" /> 
              </div>
            

            </form>


          </div>

        </div>
      </div>      
      
    );
  }

}
