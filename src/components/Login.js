import axios from 'axios';
import '../styling/Login.css';
import logo from '../res/images/Logo.png';
import React, {Component} from 'react';
import Signup from "./Signup"

export default class Login extends Component{
    
    constructor(props) {
        super(props);

        //Binds to methods that listen for events
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onLogin = this.onLogin.bind(this);

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
        })
        document.getElementById('username').style.borderColor = "transparent";
        document.getElementById('password').style.borderColor = "transparent";
    }

      //Listens for an event and sets the username state
    onChangePassword(e) {
        this.setState({
            password: e.target.value
        })
        document.getElementById('username').style.borderColor = "transparent";
        document.getElementById('password').style.borderColor = "transparent";
    }

    onLogin(e) {
        //prevents default html form submit from taking place
        e.preventDefault();
        //Creates a body for a db call with the current variables
        const userBody = {params:{
            username: this.state.username,
            password: this.state.password
        }}
       
        axios.get('http://localhost:5000/login', userBody)
        .then(res => {
            if (res.data.authenticated) {
                window.location.href = '/TheZone'; 
            }
            else {
                 document.getElementById('username').style.borderColor = "red";
                document.getElementById('password').style.borderColor = "red";
            }
        });
        console.log(userBody);
    }

    render() {
        return (
            <div className="page">
                <div className="login">
                    <img src={logo} className="logo"/>
                    <label className="slogan">Start Building Your ACS Score</label>
                    <div className="identifier">
                        <label className="text">Username or Email</label>
                        <input className="input"
                            id="username"
                            type="string"  
                            value={this.state.username}
                            onChange={this.onChangeUsername} />
                    </div>
                    <div className="identifier">
                        <label className="text" >Password</label>
                        <input className="input" 
                            id="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.onChangePassword}/>
                        <a href="" className="passwordlink">Forgot Password?</a>
                    </div>
                    <button className="loginBtn" onClick={this.onLogin}>Log In</button>
                    <br></br>
                    <div className="signup">
                        <label className="boldtext">Not a Member?</label>
                    </div>
                    <div className="signup">
                      <Signup />
                    </div>               
                </div>
            </div>
        );
    }
}
