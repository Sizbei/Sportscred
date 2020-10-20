import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../res/SportCredLogo.png';
import axios from 'axios';

import '../styling/Header.css'

export default function Header() {
  return (    
    <div className="header">
    <Link to="/" className="navbar-brand"><img src={logo} className="logo" alt="SportCred" href="the_zone"/></Link>
    <Navbar />
    <User />
    </div>
  );
}

function Navbar() {
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
      <Link to="/profile" className="nav-link">Profile</Link>
      </li>
      <li className="navbar-item">
      <Link to="/registration" className="nav-link">Registration</Link>
      </li>
    </ul>
  );
}

function User() {
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    const body = {
      params: {
        username: "user3"
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
        <Link to="/profile" className="profile-link"><img src={imgUrl} className="user-given-photo" alt="" /></Link>
      </div>
      <Link to="/profile" className="profile-link"><span> <p className="username"> Username </p> </span></Link>
    </div>
  );
}

