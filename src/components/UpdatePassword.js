import React, { Component, useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, useHistory} from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import {AuthContext} from '../Context/AuthContext';

import '../styling/Settings.css';

function checkPass(user, pass){

  fetch('/settings/account/verify/' + user + '/' + pass).then(res => res.json())
    .then(res => {
        console.log(res);
        return res.verified;
      }
    );
}

export default function Popup() {

  const [formState, setFormState] = useState("button");
  const {register, handleSubmit, watch, errors } = useForm();
  const[verifyOld, setOldState] = useState(null);
  const[verifyNew, setNewState] = useState(null);
  const[verifyConfirm, setConfirmState] = useState(null);
  

  const authContext = useContext(AuthContext);

  const submitForm = data => {
    
    fetch('/settings/account/verifypass/' + authContext.user.username + '/' + data.old).then(res => res.json())
    .then(passRes => {
        setOldState(passRes.verified);

        const passLength = data.new.length > 3;
        setNewState(passLength);

        const sameEmail = data.new === data.confirm;
        setConfirmState(sameEmail);

        const updatedInfo = {
          username: authContext.user.username,
          password: data.new,
        }
    
        if(passRes.verified && passLength && sameEmail){
          
          fetch('/settings/account/update/password', {
            method :  "put",
            body : JSON.stringify(updatedInfo),
            headers: {
                'Content-Type' : 'application/json'
            }
          }).then(res => res.json())
          .then(res => res.json())
          .catch((error) => {
            console.log(error);
          })
    
          setFormState("button")
    
        }

      }
    );

  }

  if (formState === "button") {
    return <button className="settings-submit alignRight" onClick={() => {setFormState("update"); setOldState(null); setNewState(null); setConfirmState(null);}}>Update</button>;
  } else if (formState === "update") {
    return (
      <div>

        <div className='popup-out' onClick={() => setFormState("button")}>

          <div className='popup-in' onClick = {(e) => { e.stopPropagation(); }}>

            <h2 className="settings-h2">Change your password</h2>
            <hr className="settings-hr"></hr>

            <form className="form" onSubmit={handleSubmit(submitForm)}>
              <input type="password" name="old" placeholder="CURRENT PASSWORD" autoComplete="off" className="current-password pop-input" ref={register({required: true })} maxLength="30" ></input>
              {(verifyOld == false) ? <span className="warning">Incorrect password</span> : null}
              <input type="password" name="new" placeholder="NEW PASSWORD" autoComplete="off" className="new-email pop-input" ref={register({required: true })} maxLength="30" ></input>
              {(verifyNew == false) ? <span className="warning">Password must be at least 4 characters</span> : null}
              <input type="password" name="confirm" placeholder="CONFIRM NEW PASSWORD" autoComplete="off" className="new-email pop-input" ref={register({required: true })} maxLength="30" ></input>
              {(verifyConfirm == false) ? <span className="warning">Passwords do not match</span> : null}
              <input type="submit" className="submit" value="Save" /> 

            </form>


          </div>

        </div>
      </div>      
      
    );
  }

}
