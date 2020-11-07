import React, {useState,  useEffect} from "react"
import ProfilePicture from './ProfilePicture'
import '../styling/PostView.css'

function Post(props) {
  
  return (
    <div>
        <ProfilePicture username ={'user3'}/>
        
    </div>
  )
}
export default function view (props) {
  
  /*  useEffect(() => {
    if(!props.fetched) {
        props.fetchRules();
    }
    console.log('mount it!');
  }, []);
  */
  return (
  <div>
      <div>
      <Post/>
      </div> 
  </div>
  )
}