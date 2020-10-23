import AuthService from '../Services/AuthService';
import '../styling/Login.css';
import logo from '../res/images/Logo.png';
import React, {Component, useState, useContext} from 'react';
import {AuthContext} from '../Context/AuthContext';
import Signup from "./Signup"

export default class Login extends Component{
    
    //example of using authContext in class
    //define contextType in the class using AuthContext
    //so that we are able to access it through this.context
    static contextType = AuthContext;

    constructor(props) {
        super(props);

        //Binds to methods that listen for events
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onEnter = this.onEnter.bind(this);

        //variables
        this.state = {
            username: '',
            password: ''
          }
    }

    //Listens for an event and sets the username state
    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
        document.getElementById('username').style.borderColor = "transparent";
        document.getElementById('password').style.borderColor = "transparent";
    }

      //Listens for an event and sets the username state
    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
        document.getElementById('username').style.borderColor = "transparent";
        document.getElementById('password').style.borderColor = "transparent";
    }

    onEnter(e) {
        if(e.keyCode === 13) {
            AuthService.login({username: this.state.username, password: this.state.password})
            .then(data => {
                const isAuthenticated = data.isAuthenticated;
                const user = data.user;
                if(isAuthenticated) {
                    this.context.setUser(user);
                    this.context.setIsAuthenticated(isAuthenticated);
                    this.props.history.push('/Profile/' + this.state.username);
                } else {
                    document.getElementById('username').style.borderColor = "red";
                    document.getElementById('password').style.borderColor = "red";
                }
            })
            .catch(() => {
                document.getElementById('username').style.borderColor = "red";
                document.getElementById('password').style.borderColor = "red";
            });
        }
    }

    onLogin(e) {
        //prevents default html form submit from taking place
        e.preventDefault();
        // generate a consumer of authContext
        AuthService.login({username: this.state.username, password: this.state.password})
            .then(data => {
                const isAuthenticated = data.isAuthenticated;
                const user = data.user;
                if(isAuthenticated) {
                    this.context.setUser(user);
                    this.context.setIsAuthenticated(isAuthenticated);
                    this.props.history.push('/Profile/' + this.state.username);
                } else {
                    document.getElementById('username').style.borderColor = "red";
                    document.getElementById('password').style.borderColor = "red";
                }
            })
            .catch(() => {
                document.getElementById('username').style.borderColor = "red";
                document.getElementById('password').style.borderColor = "red";
            });
    }

    render() {
        return (
            <div className="page">
                <div className="login">
                    <img src={logo} className="logo"/>
                    <label className="sloganLogin">Start Building Your ACS Score</label>
                    <div className="identifier">
                        <label className="text">Username or Email</label>
                        <input className="input"
                            id="username"
                            type="string"  
                            value={this.state.username}
                            onChange={this.onChangeUsername} />
                    </div>
                    <div className="identifier">
                        <label className="text">Password</label>
                        <input className="input" 
                            id="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.onChangePassword}
                            onKeyUp={this.onEnter} />
                        {/* <a href="" className="passwordlink">Forgot Password?</a> */}
                    </div>
                    <br></br>
                    <button className="loginBtn" onClick={this.onLogin}>Log In</button>
                    <br></br>
                    <label className="boldtext">Not a Member?</label>
                    <div className="signup">
                        <Signup />
                    </div>
                </div>
            </div>
        );
    }
}
