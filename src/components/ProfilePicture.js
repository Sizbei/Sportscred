import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../styling/ProfilePicture.css';

// Renders a profile picture with the sportcred logo around it
// As props, give EITHER a username or a url
// 
// Optionally, set absSize to true to get a fixed size that doesn't 
// scale with the viewport.
//
// Optionally, provide a scale number to scale the entire result based on 
// the size in the header. 
// Default: 1.0
//
// Optionally, provide an onClick handler to fire when the user clicks the image

export default function ProfilePicture(props) {
  const urlExists = "url" in props;
  const usernameExists = "username" in props;
  const username = "username" in props ? props.username : "";
  const scale = "scale" in props ? props.scale : 1.0;
  const abs = "abs" in props ? props.abs : false;
  const handleClick = "onClick" in props ? props.onClick : () => {
    window.open('/profile/' + username);}
  const disableBorder = "disableBorder" in props ? props.disableBorder : false;

  const [url, setUrl] = useState(urlExists ? props.url : "");

  useEffect(() => {
    if (urlExists) {
      setUrl(props.url);
    } else {
      if (!usernameExists) {
        console.log("ERROR! Must provide one of username or url to ProfilePicture.js")
        return;
      }

      fetch("/profile/" + username).then(res => res.json())
          .then(data => {
            setUrl(data.image);
          })
          .catch((error) => {
            console.log(error);
          })
    }
  }, [urlExists, username, props.url])

  let ppDivStyle;
  if (abs) {
    ppDivStyle = {
      height: scale * 100 + "px",
      width: scale * 100 + "px",
    }
  } else {
    ppDivStyle = {
      height: scale * 6 + "vw",
      width: scale * 6 + "vw",
      minHeight: scale * 6 + "vw",
      minWidth: scale * 6 + "vw",
    }
  }
    
  return (
    <div className="pp-div" style={ppDivStyle}>
      <img src={url} key={url} className="pp-photo" onClick={handleClick} alt="" />
    </div>
  )
}