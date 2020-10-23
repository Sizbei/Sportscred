import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, useHistory} from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import Header from './Header';
import Registration from './Registration'
import ImageSelect from './ImageSelect'
import logo from '../res/SportCredLogo.png';

import '../styling/Signup.css';

function ErrorMessage(props) {
  const flag = props.flag;
  const text = props.text;

  if (flag) {
    return <span className="error-message"> {text} </span>;
  } else {
    return null;
  }
} 

export default function Popup() {
  const [formState, setFormState] = useState("button");
  const [formData, setFormData] = useState({});
  const { register, handleSubmit, watch, errors } = useForm();
  const [usernameExists, setUsernameExists] = useState(false)
  const [usernameIllegal, setUsernameIllegal] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const [genderState, setGenderState] = useState("male");
  const bannedUsernames = ["profile"];

  let history = useHistory();

  // Reset state
  const close = () => {
    setFormState("button");
    setFormData({});
    setUsernameExists(false);
    setEmailExists(false);
    setGenderState("male");
  }

  const submitData = (data) => {
    console.log(data);
    axios.post('http://localhost:5000/signup/add', data).then(processResponse).catch(processError);
  }

  const processResponse = res => {
    if (res.status == 200) {
      console.log("New user has been added!");
      history.push("/profile/" + formData["username"]);
      close();
    }
  }

  const processError = () => {
    console.log("Error! Is a field missing?");
    close();
  }

  const submitForm0 = data => {
    if (usernameExists || usernameIllegal || emailExists) {
      return;
    }

    Object.keys(data).forEach((name, val) => {
      formData[name] = data[name];
    }) 

    setFormState("form-1");
  }

  const submitForm1 = data => {
    Object.keys(data).forEach((name, val) => {
      formData[name] = data[name];
    }) 

    setFormState("form-2");
  }

  const submitForm2 = data => {
    formData.favoriteTeam = data;
    submitData(formData);
  }


  const checkUsernameExists = async (username) => {
    const send = {
      params: {
        username: username
      }
    }
    
    const returnValue = await axios.get('http://localhost:5000/signup/existingUsername', send);
    return returnValue.data.exists;
  }

  const handleUsernameChange = async (e) => {    
    const username = e.target.value;
    setUsernameExists(await checkUsernameExists(username));

    if (bannedUsernames.some(v => {return v === username.toLowerCase()})) {
      setUsernameIllegal(true);
    } else {
      setUsernameIllegal(false);
    }
  }

  const checkEmailExists = async (email) => {
    const send = {
      params: {
        email: email
      }
    }
    
    const returnValue = await axios.get('http://localhost:5000/signup/existingEmail', send);
    return returnValue.data.exists;
  }

  const handleEmailChange = async (email) => {    
    setEmailExists(await checkEmailExists(email.target.value));
  }

  const year = (new Date()).getFullYear();
  const years = Array.from(new Array(120),( val, index) => -index + year);

  const [imageSelect, setImageSelect] = useState(null);

  const handleImageSelectData = (result) => {
    submitForm2(result);
  }

  useEffect(() => {
    fetch('/teams').then(res => res.json())
    //axios.get('http://localhost:5000/teams/', "")
      .then(data => {
        setImageSelect(<ImageSelect btntext="Finish!" data={data} width={6} onSubmit={handleImageSelectData} maxTeams={9} />)
      }
    ); 
  }, [])

  if (formState === "button") {
    return <button className="SignUpBtn" onClick={() => {setFormState("form-0")}}> Sign up </button>;
  } else if (formState === "form-0") {
    return (
      <div>
        <button className="SignUpBtn" onClick={() => {}}> Sign up </button>
      
        <div className='popup' onClick={() => setFormState("button")}>
          <div className='popup_inner' onClick = {(e) => { e.stopPropagation(); }}>
            <div className="signup-logo-container">
              <img src={logo} className="signup-logo" alt="SportCred" href="the_zone"/>
              <span className="slogan">Start Building Your ACS Score</span>
            </div>

            <form className="form" onSubmit={handleSubmit(submitForm0)}>
              <div className="div-name">
                <div className="div-firstname">
                  <input name="firstName" className="input-firstname" placeholder="First name" ref={register({ required: true })} />
                  {errors.firstName && <span className="error-message">This field is required.</span>}
                </div>

                <div className="div-lastname">
                  <input name="lastName" className="input-lastname" placeholder="Last name" ref={register({ required: true })} />
                  {errors.lastName && <span className="error-message">This field is required.</span>}
                </div>
              </div>

              <input name="username" className="signup-input-field" placeholder="Username" ref={register({ required: true })} onInput={handleUsernameChange} />
              <ErrorMessage flag={usernameExists} text="This username already exists." />
              <ErrorMessage flag={usernameIllegal} text='Illegal username.' />
              {errors.username && <span className="error-message">This field is required.</span>}

              <input type="password" className="signup-input-field" placeholder="Password" name="password" ref={ register({ required: true }) } />
              {errors.password && <span className="error-message">This field is required.</span>}

              <input name="email" className="signup-input-field" placeholder="Email" ref={register({ required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              }})} onInput={handleEmailChange} />

              <ErrorMessage flag={emailExists} text="This email has already been used." />
              {errors.email && errors.email.type === "required" && <span className="error-message">This field is required.</span>}
              {errors.email && errors.email.type === "pattern" && <span className="error-message">Invalid email address.</span>}

              <input name="phoneNumber" className="signup-input-field" placeholder="Phone Number (optional)" ref={register} />

              <label className="form-label">Birthday:</label>
              <div className="birthdate-container">
                <select name="month" ref={register} className="select-month" >
                  <option value="January">Jan</option>
                  <option value="February">Feb</option>
                  <option value="March">Mar</option>
                  <option value="April">Apr</option>
                  <option value="May">May</option>
                  <option value="June">Jun</option>
                  <option value="July">Jul</option>
                  <option value="August">Aug</option>
                  <option value="September">Sep</option>
                  <option value="October">Oct</option>
                  <option value="November">Nov</option>
                  <option value="December">Dec</option>
                </select>

                <select name="day" ref={register} className="select-day" >
                  {
                    Array(31).fill(1).map((el, i) => <option value={i+1} key={i+1}>{i + 1}</option>) 
                  }
                </select>

                <select name="year" ref={register} className="select-year" >
                  {
                    years.map((year, index) => {
                      return <option key={year} value={year}>{year}</option>
                    })
                  }
                </select>
              </div>

              <label className="form-label">Gender:</label>
              <div className="gender-container">
                  <span className="radio-container" onClick={ () => setGenderState("male") }> 
                    <label className="radio-text">male</label>
                    <input type="radio" name="gender-male" className="gender-radio" checked={genderState === "male"} readOnly></input>
                  </span>
                  <span className="radio-container" onClick={ () => setGenderState("female") }> 
                    <label className="radio-text">female</label>
                    <input type="radio" name="gender-female" className="gender-radio" checked={genderState === "female"} readOnly></input>
                  </span>
                  <span className="radio-container" onClick={ () => setGenderState("other") }> 
                    <label className="radio-text">other</label>
                    <input type="radio" name="gender-other" className="gender-radio" checked={genderState === "other"} readOnly></input>
                  </span>
              </div>

              <input type="submit" className="submit" value="Continue" /> 
            </form>
          </div>
        </div>
      </div>
    )
  } else if (formState === "form-1") {
    return (
      <div>
      <button className="SignUpBtn" onClick={() => {}}> Sign up </button>
    
      <div className='popup' onClick={() => setFormState("button")}>
        <div className='popup_inner' onClick = {(e) => { e.stopPropagation(); }}>
          <div className="signup-logo-container">
            <img src={logo} className="signup-logo" alt="SportCred" href="the_zone"/>
            <span className="slogan">Start Building Your ACS Score</span>
          </div>

          <form className="form" onSubmit={handleSubmit(submitForm1)}>
            <label className="form-question">Favorite sport?</label>
            <input name="favoriteSport" key="favoriteSport" className="signup-input-field" defaultValue="" ref={register({ required: true })} />
            {errors.favoriteSport && <span className="error-message">This field is required.</span>}

            <label className="form-question">What sport would you like to know more about?</label>
            <input name="sportInterest" key="sportInterest" className="signup-input-field" defaultValue="" ref={register({ required: true })} />
            {errors.sportInterest && <span className="error-message">Tell us!</span>}

            <label className="form-question">What is your highest level of play in any sport?</label>

            <select name="highestLevelOfPlay" ref={register} className="select-highestLevelOfPlay" >
              <option value="noHistory" key="noHistory"> No History </option>
              <option value="highschool">High School</option>
              <option value="university">University</option>
              <option value="professional">Professional</option>
            </select>
            

            <input type="submit" className="submit" value="Continue" /> 
          </form>
        </div>
      </div>
    </div>
    )
  } else if (formState === "form-2") {
    return (
      <div>
        <button className="SignUpBtn" onClick={() => {}}> Sign up </button>

        <div className='popup' onClick={() => setFormState("button")}>
        <div className='popup_inner' onClick = {(e) => { e.stopPropagation(); }}>
          <div className="signup-logo-container">
            <img src={logo} className="signup-logo" alt="SportCred" href="the_zone"/>
            <span className="slogan">Start Building Your ACS Score</span>
          </div>

          <label className="form-question">What are your favorite teams?</label>
          <div className="signup-imageselect-container">
            {imageSelect}
          </div>
        </div>
      </div>
    </div>
    )
  }
}