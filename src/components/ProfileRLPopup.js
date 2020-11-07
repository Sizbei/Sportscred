import React, { Component, useEffect, useState } from 'react';
import RadarList from './RadarList'
import '../styling/ProfilePopup.css';  


export default function PopUp(props) {
  const closePopup = props.closePopup;
  const radarList = props.radarList;
  const changeUser = (user) => props.changeUser(user); 

  return (
    <div className='profile-popup' onClick={closePopup}>  
    <div className='profile-rl-popup-content' onClick = {(e) => { e.stopPropagation(); }}>  
      <RadarList radarList={radarList} changeUser={changeUser}/>
      
    </div>  
  </div>  
  )
}