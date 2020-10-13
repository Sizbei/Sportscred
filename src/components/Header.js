import React from 'react';
import { Link } from 'react-router-dom';
// import Navbar from "./Navbar"
import logo from '../res/whitesportcred.png';
import logoborder from '../res/ACSBorder.png';
import placeholderprofile from '../res/dog.jpg';

import "./Header.css"

export default function Header() {
  return (    
    <div className="header">
    <Link to="/" className="navbar-brand"><img src={logo} className="logo" alt="SportCred" href="the_zone"/></Link>
    {/* <HeaderMenu /> */}
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
    </ul>
  );
}

function User() {
  return (
    <div className="user-info">
      {/* <img src={logoborder}></img> */}
      <div className="user-photo">
        {/* <Link to="/profile"><img src={placeholderprofile} className="user-given-photo" alt="Profile" /></Link> */}
        <img src={placeholderprofile} className="user-given-photo" alt="Profile" />
      </div>
      <Link to="/profile" className="profile-link"><span> <p className="username"> Username </p> </span></Link>
    </div>
  );
}

