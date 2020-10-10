import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">SportCred</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
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
        </div>
      </nav>
    );
  }
}