import React, { Component, useState } from 'react';
import { useForm } from "react-hook-form";
import { BrowserRouter as Router, Route, useHistory} from "react-router-dom";
import axios from 'axios';
import preview from '../res/account-circle.svg'
import Header from "./Header"
import '../styling/Registration.css'

function ErrorMessage(props) {
  const flag = props.flag;
  const text = props.text;

  if (flag) {
    return <span className="error-message"> {text} </span>;
  } else {
    return null;
  }
} 

// function ExistsField(props) {
//   const dbField = props.field;
//   const text = props.text;
//   const [exists, setExists] = useState(false);
//   const { register, handleSubmit, watch, errors } = useForm();

//   const checkExists = async (exists) => {
//     const send = {
//       params: {
//       }
//     }

//     send["params"][dbField] = exists
    
//     const returnValue = await axios.get('http://localhost:5000/signup/findExisting', send);
//     console.log(returnValue.data.exists);
//     return returnValue.data.exists;
//   }

//   const handleFieldChange = async (field) => {    
//     setExists(await checkExists(field.target.value));
//   }

//   return (
//     <div>
//       <input name={dbField} ref={register({ required: true })} onInput={handleFieldChange} />
//       {errors.username && <span className="error-message">This field is required.</span>}
//       <ErrorMessage flag={exists} text={text} />
//     </div>
//   )
// }

export default function Registration() {

  let history = useHistory();
  const { register, handleSubmit, watch, errors } = useForm();
  const [imgPreview, setImgPreview] = useState(require('../res/account-circle.svg'))
  const [usernameExists, setUsernameExists] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const [imageExists, setImageExists] = useState(false)
  const [remainingError, setRemainingError] = useState(false)
  const prev = "";

  const processResponse = res => {
    console.log("Got:");
    console.log(res.data);
  }

  const onSubmit = async data => {
    console.log(data);
    console.log(typeof data);
    
    if (await checkUsernameExists(data.username)) {
      console.log("Username already exists!");
      setRemainingError(true);
      return;
    }

    if (await (checkEmailExists(data.email))) {
      console.log("Username already exists!");
      setRemainingError(true);
      return;
    }

    axios.post('http://localhost:5000/signup/add', data)
    .then(processResponse);

    history.push("/profile") // Navigate to where next?
  };
  
  const handleURLChange = (e) => {
    setImgPreview(e.target.value);
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

  const handleUsernameChange = async (username) => {    
    setUsernameExists(await checkUsernameExists(username.target.value));
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

  const handleImageError = () => {
    console.log("failed to load image.");
    setImageExists(true);
    setImgPreview(require('../res/account-circle.svg'))
  }

  const handleImageLoad = () => {
    setImageExists(false);
  }

  return(   
    <div className="registration">
      <Header />
      
      
      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)}>

          <h1>Sign Up</h1>

          <div className="preview">
            <div className="registration-photo">
              <img src={imgPreview} key={imgPreview} className="registration-user-given-photo" alt="" onError={handleImageError} onLoad={handleImageLoad} />
            </div>
            <ErrorMessage flag={imageExists} text="Improper url." />
          </div>

          <label>Profile Picture URL: </label>
          <input type="text"name="url" ref={register({ required: true })} onInput={handleURLChange}/>
          {errors.url && <span className="error-message">This field is required.</span>}

          <label>First Name:</label>
          <input name="firstName" ref={register({ required: true })} />
          {errors.firstName && <span className="error-message">This field is required.</span>}

          <label>Last Name:</label>
          <input name="lastName" ref={register({ required: true })} />
          {errors.lastName && <span className="error-message">This field is required.</span>}

          <label>Username:</label>
          <input name="username" ref={register({ required: true })} onInput={handleUsernameChange} />
          <ErrorMessage flag={usernameExists} text="This username already exists." />
          {errors.username && <span className="error-message">This field is required.</span>}

          {/* <ExistsField field="username" text="This username already exists." /> */}

          <label>Password:</label>
          <input type="password" name="password" ref={ register({ required: true }) } />
          {errors.password && <span className="error-message">This field is required.</span>}

          <label>Age:</label>
          <input name="age" ref={register({ required: true })} />
          {errors.age && <span className="error-message">This field is required.</span>}

          <label>Email:</label>
          <input name="email" ref={register({ required: true,
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          }})} onInput={handleEmailChange} />

          <ErrorMessage flag={emailExists} text="This email has already been used." />
          {errors.email && errors.email.type === "required" && <span className="error-message">This field is required.</span>}
          {errors.email && errors.email.type === "pattern" && <span className="error-message">Invalid email address.</span>}

          <label>Phone Number:</label>
          <input name="phoneNumber" ref={register({ required: true })} />
          {errors.phoneNumber && <span className="error-message">This field is required.</span>}

          <label>Gender:</label>
          <select name="gender" ref={register} >
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="other">other</option>
          </select>

          <label>Favorite sport?</label>
          <input name="favoriteSport" ref={register({ required: true })} />
          {errors.favoriteSport && <span className="error-message">This field is required.</span>}

          <label>Highest level of play?</label>
          <select name="highestLevelOfPlay" ref={register} className="" >
            <option value="noHistory">No History</option>
            <option value="highschool">High School</option>
            <option value="university">University</option>
            <option value="professional">Professional</option>
          </select>

          <label>What sport would you like to know/learn about?</label>
          <input name="sportInterest" ref={register({ required: true })} />
          {errors.sportInterest && <span className="error-message">This field is required.</span>}

          <label>What are your favorite sports teams?</label>
          <input name="favoriteTeam" ref={register({ required: true })} />
          {errors.favoriteTeam && <span className="error-message">This field is required.</span>}

          <input type="submit" className="submit" value="Continue" /> 
          {/* <div className="submit-missing-message"><ErrorMessage flag={remainingError} text="There are still uncompleted field(s)." /></div> */}
        </form>
      </div>
    </div>
  );
}

