import React, { useState } from 'react';
import axios from 'axios';
import  '../styling/PostTrivia.css';
import ProfilePicture from './ProfilePicture'

export default function PostTrivia(props) {
  const handleClosePostTrivia = props.handleClosePostTrivia;
  const handleModeSelect = props.handleModeSelect;
  const score = "score" in props ? props.score : {user:0, enemy:0};
  const list = props.list;
  const mode = props.mode;
  const username = props.username;
  const acsChange = "acsChange" in props ? props.acsChange : {user:"none", enemy:"none"};
  const ppurl = "ppurl" in props ? props.ppurl : {user: "", enemy: ""};
  const nav = mode === "nav";
  const acs = (function() {    
    if (props.gameOver) {
      if ("finalACS" in props) {
        return props.finalACS;
      } else {
        return {
          user: props.initialACS.user + acsChange.user,
          enemy: props.initialACS.enemy + acsChange.enemy
        }
      }
    } else {
      return props.initialACS;
    }
  })();
  
  const [visible, setVisible] = useState('visible');

  var visibleJSON = {
      visibility: visible
  }

  const handleClickName = (user) => {window.open('/profile/' + user)}

  const userHeaderSection = (
    <div className="post-header-block post-header-us">
      <span className="post-header-username">
        <span onClick={() => handleClickName(username.user)}>{username.user}</span> &nbsp;
        <span className="post-header-acs">({acs != null ? acs.user : "-"})</span>
        &nbsp;
        <ACSChange change={acsChange.user} />
      </span>
      <ProfilePicture scale={1.5} url={ppurl.user} username={username.user}/>
      <label className="post-header-score">{score.user}</label>
    </div>
  );

  const enemyHeaderSection = mode === "online" ? (
    <div className="post-header-block post-header-them">
      <span className="post-header-username">
        <span onClick={() => handleClickName(username.enemy)}>{username.enemy}</span> &nbsp;
        <span className="post-header-acs">({acs != null ? acs.enemy : "-"})</span>
        &nbsp;
        <ACSChange change={acsChange.enemy} />
      </span>
      <ProfilePicture scale={1.5} url={ppurl.enemy} username={username.enemy}/>
      <label className="post-header-score">{score.enemy}</label>
    </div>
  ) : null;

  const Hide = () => {
      console.log("Closing post trivia...");
      setVisible('hidden');
      handleClosePostTrivia();
  }

  const winnerText = (function() {
    if (props.winner == "user") {
      return "win";
    } else if (props.winner == "tie") {
      return "tie";
    } else if (props.winner == "enemy") {
      return "loss";
    } else {
      return props.winner;
    }
  })();

  // const winnerDiv = props.mode == "online" ? (
  //   <div className="post-winner"> 
  //     <label className={"post-" + winnerText}>{(function() {
  //       if (winnerText == "win") {
  //         return "VICTORY";
  //       } else if (winnerText == "tie") {
  //         return "TIE";
  //       } else {
  //         return "DEFEAT";
  //       }
  //     })()}</label>
  //   </div>
  // ) : null;

  const winnerDiv = (
    <div className="post-winner"> 
      {props.mode == "online" ? (
        <label className={"post-" + winnerText}>{(function() {
          if (winnerText == "win") {
            return "VICTORY";
          } else if (winnerText == "tie") {
            return "TIE";
          } else {
            return "DEFEAT";
          }
        })()}</label>
      ) : null}
    </div>
  )

  console.log(props, winnerText);

  return (
      <div>
          <div className='post-popup' onClick={() => Hide()} style={visibleJSON}/>
          <div className='post-popup_inner' style={visibleJSON}>
            <div className="post-header">
              {userHeaderSection}
              {enemyHeaderSection}
            </div>
            {winnerDiv}
            <div className="post-nav">
              <button className="post-nav-button" onClick={() => handleModeSelect("playAgain")}>
                <label className="post-nav-button-label">Play Again</label>
              </button>
              <button className="post-nav-button" onClick={() => handleModeSelect("nav")}>
                <label className="post-nav-button-label">Select Mode</label>
              </button>
            </div>
          </div>
      </div> 
  );
}

function ACSChange(props) {
  const change = "change" in props ? props.change : "none";

  if (change === "none") {
    return <span className={"post-header-acschange-zero"}>&nbsp;&nbsp;</span>
  }

  if (change > 0) {
    return (
      <span className={"post-header-acschange-positive"}>+{change}</span>
    )
  } else if (change == 0) {
    return (
      <span className={"post-header-acschange-zero"}>+0</span>
    )
  } else {
    return (
      <span className={"post-header-acschange-negative"}>{change}</span>
    )
  }
}