import React, { useEffect, useState, useContext} from 'react';
import { Link, useHistory } from 'react-router-dom';
import logo from '../res/SportCredLogo.png';
import axios from 'axios';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import '../styling/Header.css'

export default function Header() {

  const authContext = useContext(AuthContext);
  if(authContext.user.username){
    return (    
      <div className="header">
      <Link to="/" className="navbar-brand"><img src={logo} className="logo" alt="SportCred" href="the_zone"/></Link>
      <Navbar />
      <User />
      <OptionsMenu />
      </div>
    );
  } else {
    return null;
  }
  
}

function Navbar() {
  return (
    <ul className="navbar">
      <li className="navbar-item">
        <Link to="/" className="nav-link">The Zone</Link>
      </li>
      <li className="navbar-item">
        <Link to={{pathname: "/trivia", key: Math.random(), state: {applied: true}}} key={Math.random()} className="nav-link">Trivia</Link>
      </li>
      <li className="navbar-item">
        <Link to="/analysis" className="nav-link">Analysis</Link>
      </li>
      <li className="navbar-item">
        <Link to="/ip" className="nav-link">Individual Predictions</Link>
      </li>
      <li className="navbar-item">
        <Link to="/bracket" className="nav-link">Playoff Predictions</Link>
      </li>
      <li className="navbar-item">
        <Link to="/prediction/leaderboard" className="nav-link">Predictions Leaderboard</Link>
      </li>
    </ul>
  );
}

function User() {
  const [imgUrl, setImgUrl] = useState("");
  const [ACS, setACS] = useState("");
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const repeat = setInterval(() => {
      fetch('/settings/profile/' + authContext.user.username).then(res => res.json())
      //axios.get("http://localhost:5000/settings/profile", body)
        .then(data => {
          setImgUrl(data.image);
        })

      fetch( "/profile/" + authContext.user.username + "/acs").then(res => res.json()) 
      .then(data => {
          setACS(data.acsTotal);
      })
    }, 500)
    return () => clearInterval(repeat)
  }, [])
  return (
    <div className="user-info">
      <div className="user-photo">
        <Link to={'/profile/' + authContext.user.username} className="profile-link">
          <img src={imgUrl} className="user-given-photo" alt="" /></Link>
      </div>
      <div className="user-text">
        <Link to={'/profile/' + authContext.user.username} className="profile-link"><span>
          <p className="username"> {authContext.user.username} </p></span></Link>
        
        <span className="user-acs">&nbsp;&nbsp; ({ACS})</span>
      </div>
    </div>
  );
}

function OptionsMenu() {
  const authContext = useContext(AuthContext);
  let history = useHistory(); 
  console.log(authContext);

  const LogOut = () => {
    console.log("Logging out...");
    AuthService.logout().then((data) => {
    if(data.success){
      authContext.setUser(data.user);
      authContext.setIsAuthenticated(false);
    }
    });
  }

  const navigateToSettings = () => {
    history.push("/settings/account");
  }

  const navigateToCitations = () => {
    history.push("/citations");
  }

  const navigateToReports = () => {
    history.push("/reports/post");
  }

  return (
    <div className="options">
      <button className="optionsMenu" />
          <div className="optionsContent">
          <button className="optionsButtonsTopEnd" onClick={navigateToSettings}>Settings</button>
          <button className="optionsButtons" onClick={navigateToCitations}>Citations</button>
          {authContext.user.permissions === "Moderator" ? <button className="optionsButtons" onClick={navigateToReports}> Reports </button> : null }
          <button className="optionsButtonsBotEnd" onClick={LogOut}>Log Out</button>
        </div>
    </div>
  );
}


