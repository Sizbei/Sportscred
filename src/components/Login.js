import axios from 'axios';
import '../styling/Login.css';
import logo from '../res/images/Logo.png';
import React, {Component} from 'react';

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
            <div class="page">
                <div class="login">
                    <img src={logo} class="logo"/>
                    <label class="slogan">Start Building Your ACS Score</label>
                    <div class ="identifier">
                        <label class="text">Username or Email</label>
                        <input class="input"
                            id="username"
                            type="string"  
                            value={this.state.username}
                            onChange={this.onChangeUsername} />
                    </div>
                    <div class="identifier">
                        <label class="text" >Password</label>
                        <input class="input" 
                            id="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.onChangePassword}/>
                        <a href="" class="passwordlink">Forgot Password?</a>
                    </div>
                    <button class="loginBtn" onClick={this.onLogin}>Log In</button>
                    <br></br>
                    <div class="signup">
                        <label class ="boldtext">Not a Member?</label>
                    </div>
                    <div class="signup">
                        <a href="/Registration" class="signuplink">Sign Up</a> 
                    </div>               
                </div>
            </div>
        );
    }
}
