import React from 'react';
import { useForm } from "react-hook-form";
import './Registration.css'

export default function Registration() {
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = data => console.log(data);

  return(
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign Up</h1>


        <label>First Name:</label>
        <input name="firstName" ref={register({ required: true, maxLength: 5 })} />

        <label>Last Name:</label>
        <input name="lastName" ref={register({ required: true })} />

        <label>Username:</label>
        <input name="userName" ref={register({ required: true })} />

        <label>Password:</label>
        <input type="password" name="password" ref={register({ required: true })} />

        <select name="gender" ref={register} className="select-gender" >
          <option value="male">female</option>
          <option value="female">male</option>
          <option value="other">other</option>
        </select>

        {errors.exampleRequired && <span>This field is required.</span>}
        <input type="submit" className="submit" />
      </form>
    </div>
  );

  // return (
  //   <form onSubmit={handleSubmit(onSubmit)}>
  //   {/* register your input into the hook by invoking the "register" function */}
  //     <input name="firstName" ref={register} />
      
  //     {/* include validation with required or other standard HTML validation rules */}
  //     <input name="exampleRequired" ref={register({ required: true })} />
  //     {/* errors will return when field validation fails  */}
  //     {errors.exampleRequired && <span>This field is required</span>}
      
  //     <input type="submit" />
  //   </form>
  // );
}