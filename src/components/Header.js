import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar"
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