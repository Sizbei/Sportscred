import React from 'react'
import axios from 'axios';
import './styling/Login.css';
import logo from './resources/Logo.png'


function App() {
    return (
        <div class="page">
            <div class="login">
                <img src={logo} class="logo"/>
                <label class="slogan">Start Building Your ACS Score</label>
                <div class ="identifier">
                    <label class="text">Username or Email</label>
                    <input class="input"></input>
                </div>
                <div class="identifier">
                    <label class="text">Password</label>
                    <input class="input"></input>
                    <div class="right">
                        <a href="" class="passwordlink">Forgot Password?</a>
                    </div>
                </div>
                <button class="loginBtn" onClick="location.href='https://google.com">Log In</button>
                <div class="signup">
                    <label class ="boldtext">Not a Member?</label>
                    <br></br>
                    <a href="/Registration" class="signuplink">Sign Up</a> 
                </div>
            </div>
        </div>
    )
}

export default App