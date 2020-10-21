import React, { useEffect, useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import logo from '../res/SportCredLogo.png';
import axios from 'axios';
import {AuthContext} from '../Context/AuthContext';

import '../styling/Header.css'

export default function Header() {

  const authContext = useContext(AuthContext);
  if(authContext.user.username){
    return (    
      <div className="header">
      <Link to="/" className="navbar-brand"><img src={logo} className="logo" alt="SportCred" href="the_zone"/></Link>
      <Navbar />
      <User />
      </div>
    );
  } else {
    return null;
  }
  
}

function Navbar() {
  const authContext = useContext(AuthContext);
  console.log(authContext.user.username);

  return (
    <ul className="navbar">
      <li className="navbar-item">
      <Link to="/" className="nav-link">The Zone</Link>
      </li>
      <li className="navbar-item">
      <Link to="/trivia" className="nav-link">Trivia</Link>
      </li>
      <li className="navbar-item">
      <Link to="/analysis" className="nav-link">Analysis</Link>
      </li>
      <li className="navbar-item">
      <Link to="/picksandpredictions" className="nav-link">Picks/Predictions</Link>
      </li>
      <li className="navbar-item">
      <Link to="/registration" className="nav-link">Registration</Link>
      </li>
    </ul>
  );
}

function User() {
  const [imgUrl, setImgUrl] = useState("");
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const body = {
      params: {
        username: authContext.user.username
      }
    }
    axios.get("http://localhost:5000/settings/profile", body).then(
      e => {
        console.log("headeer data", e.data.image);
        setImgUrl(e.data.image);
      } 
    )
  })




  return (
    <div className="user-info">
      <div className="user-photo">
        <Link to={'/profile/' + authContext.user.username} className="profile-link">
          <img src={imgUrl} className="user-given-photo" alt="" /></Link>
      </div>
      <Link to={'/profile/' + authContext.user.username} className="profile-link"><span>
        <p className="username"> {authContext.user.username} </p></span></Link>
      
    </div>
  );
}

