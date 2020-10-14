import React, { Component, useState } from 'react';
import { useForm } from "react-hook-form";
import { BrowserRouter as Router, Route, useHistory} from "react-router-dom";
import TheZone from "./TheZone";
import preview from '../res/account-circle.svg';
import './Registration.css'

export default function Registration() {

  let history = useHistory();
  const { register, handleSubmit, watch, errors } = useForm();
  const [imgPreview, setImgPreview] = useState("https://i.imgur.com/9fyUaFV.jpg")
  const prev = "";

  const onSubmit = data => {
    console.log(data);
    
    history.push("/morequestions") // Navigate to profile next 
  };

  const updatePreview = () => {
    console.log("preview")
    console.log({prev})
    setImgPreview('https://i.imgur.com/55sUslQ.png')
    console.log({imgPreview})
  };
  
  return(   
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign Up</h1>

        <div className="preview">
          <div className="registration-photo">
            <img src={imgPreview} key={imgPreview} className="registration-user-given-photo" alt="Preview!" />
          </div>
        </div>

        <label>Profile Picture URL: {imgPreview} </label>
        <input type="text" name="url" ref={register({ required: true })} />
        <button onClick={updatePreview}>Preview!</button>

        <label>First Name:</label>
        <input name="firstName" ref={register({ required: true, maxLength: 20 })} />

        <label>Last Name:</label>
        <input name="lastName" ref={register({ required: true })} />

        <label>Age:</label>
        <input name="lastName" ref={register({ required: true })} />

        <label>Username:</label>
        <input name="userName" ref={register({ required: true })} />

        <label>Password:</label>
        <input type="password" name="password" ref={register({ required: true })} />

        <label>Gender:</label>
        <select name="gender" ref={register} >
          <option value="male">male</option>
          <option value="female">female</option>
          <option value="other">other</option>
        </select>

        <label>Favorite sport?</label>
        <input name="favoriteSport" ref={register({ required: true })} />

        <label>Highest level of play?</label>
        <select name="highestLevelOfPlay" ref={register} className="" >
          <option value="noHistory">No History</option>
          <option value="highschool">High School</option>
          <option value="university">University</option>
          <option value="professional">Professional</option>
        </select>

        <label>What sport would you like to know/learn about?</label>
        <input name="firstName" ref={register({ required: true })} />

        <label>What are your favorite sports teams?</label>
        <input name="firstName" ref={register({ required: true })} />

        {errors.exampleRequired && <span>This field is required.</span>}
        <input type="submit" className="submit" value="Continue" />
      </form>
    </div>
  );
}