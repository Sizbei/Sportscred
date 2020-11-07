import React, {Component, useEffect, useState, useContext} from 'react';
import toastr from 'toastr'
import '../styling/Settings.css'
import '../styling/toastr.min.css'
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import UpdateEmail from "./UpdateEmail"
import UpdatePassword from "./UpdatePassword"
import DeactivateAccount from "./DeactivateAccount"

export default function EditAccount() {

  const [email, setEmail] = useState(0);
  //const [password, setPassword] = useState(0);
  const authContext = useContext(AuthContext);
  

  useEffect(() => {
    fetch('/settings/account/' + authContext.user.username).then(res => res.json())
    .then(user => {
      setEmail(user.email);
    })
  }, []);



  function handleChangeEmail(e) {
    setEmail(e);
  }
  

  return (
    <div className="account-container">
      <div className="settings-container-mid"> 
          
          <div className="information-container"> 
          <h1 className="settings-h1"> {'Account Settings'} </h1> 

              <hr className="settings-hr"></hr>
              <div className="account-content-container">
                <h2 className="settings-h2">Email address</h2>
                <UpdateEmail handleChangeEmail={handleChangeEmail}/>
              </div>
              <label className="email" >{email}</label>
              
              <hr className="settings-hr"></hr>
              <div className="account-content-container">
                <h2 className="settings-h2">Change Password</h2>
                <UpdatePassword />
              </div>

              <DeactivateAccount />


          </div>
      </div>
      
      </div>
  )


}