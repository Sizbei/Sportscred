import React, { Component, useState } from 'react';
import { useForm } from "react-hook-form";
import { BrowserRouter as Router, Route, useHistory} from "react-router-dom";
import axios from 'axios';

import './Registration.css'

export default function Registration() {

  let history = useHistory();
  const { register, handleSubmit, watch, errors } = useForm();
  const [imgPreview, setImgPreview] = useState("")
  const prev = "";

  const processResponse = res => {
    console.log("Got:");
    console.log(res.data);
  }

  const onSubmit = data => {
    console.log(data);
    console.log(typeof data);
    
    
    // axios.post('http://localhost:5000/signup/add', data)
    // .then(res => console.log(res.data));
    axios.post('http://localhost:5000/signup/add', data)
    .then(processResponse);

    history.push("/morequestions") // Navigate to profile next 
  };

  const updatePreview = () => {
    console.log("preview")
    console.log({prev})
    setImgPreview('https://i.imgur.com/55sUslQ.png')
    console.log({imgPreview})
  };
  
  const handleURLChange = (e) => {
    console.log(e.target.value);
    setImgPreview(e.target.value);
  }

  return(   
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign Up</h1>

        <div className="preview">
          <div className="registration-photo">
            {/* <img src={imgPreview} key={imgPreview} className="registration-user-given-photo" onerror="this.src='../res/account-circle.svg'" alt=" " /> */}
            <img src={imgPreview} key={imgPreview} className="registration-user-given-photo" alt="" />
            {/* <object className="registration-user-given-photo" data={imgPreview} type="image"></object> */}
          </div>
        </div>

        <label>Profile Picture URL: </label>
        <input type="text"name="url" ref={register({ required: true })} onInput={handleURLChange}/>
        {/* <button onClick={updatePreview}>Preview!</button> */}
        {/* <br></br> */}
        {errors.url && <span className="required-error">This field is required.</span>}

        <label>First Name:</label>
        <input name="firstName" ref={register({ required: true })} />
        {errors.firstName && <span className="required-error">This field is required.</span>}

        <label>Last Name:</label>
        <input name="lastName" ref={register({ required: true })} />
        {errors.lastName && <span className="required-error">This field is required.</span>}

        <label>Username:</label>
        <input name="username" ref={register({ required: true })} />
        {errors.userName && <span className="required-error">This field is required.</span>}

        <label>Password:</label>
        <input type="password" name="password" ref={ register({ required: true }) } />
        {errors.password && <span className="required-error">This field is required.</span>}

        <label>Age:</label>
        <input name="age" ref={register({ required: true })} />
        {errors.age && <span className="required-error">This field is required.</span>}

        <label>Email:</label>
        <input name="email" ref={register({ required: true })} />
        {errors.email && <span className="required-error">This field is required.</span>}

        <label>Phone Number:</label>
        <input name="phoneNumber" ref={register({ required: true })} />
        {errors.phoneNumber && <span className="required-error">This field is required.</span>}

        <label>Gender:</label>
        <select name="gender" ref={register} >
          <option value="male">male</option>
          <option value="female">female</option>
          <option value="other">other</option>
        </select>

        <label>Favorite sport?</label>
        <input name="favoriteSport" ref={register({ required: true })} />
        {errors.favoriteSport && <span className="required-error">This field is required.</span>}

        <label>Highest level of play?</label>
        <select name="highestLevelOfPlay" ref={register} className="" >
          <option value="noHistory">No History</option>
          <option value="highschool">High School</option>
          <option value="university">University</option>
          <option value="professional">Professional</option>
        </select>

        <label>What sport would you like to know/learn about?</label>
        <input name="sportInterest" ref={register({ required: true })} />
        {errors.sportInterests && <span className="required-error">This field is required.</span>}

        <label>What are your favorite sports teams?</label>
        <input name="favoriteTeam" ref={register({ required: true })} />
        {errors.favoriteTeams && <span className="required-error">This field is required.</span>}

        <input type="submit" className="submit" value="Continue" /> 
      </form>
    </div>
  );
}