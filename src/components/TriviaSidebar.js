import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Header from './Header';
import '../styling/TriviaSidebar.css';
import icon from '../res/images/puzzle-piece.png'
import ProfilePicture from './ProfilePicture';

function QuestionPreviewText(props) {
  const max = 56;
  const ellipses = props.text.length > max;
  let text = props.text.substring(0, max);
  while (text.length > 0 && text[text.length - 1] === ' ') {
    text = text.substring(0, text.length -  1);
  }

  return (
    <span className="TSBG-list-item-text"> {text + (ellipses ? "..." : "")}</span>
  )
}

function QuestionListItem(props) {
  const mode = props.mode;
  const number = props.number;
  const text = "text" in props ? props.text : "";  
  const userCorrect = "userCorrect" in props ? props.userCorrect : "none";
  const enemyCorrect = "enemyCorrect" in props ? props.enemyCorrect : "none";
  const multiplayer = mode === "online";

  const checkmark = (
    <div className="TSBG-list-item-mark-div">
      <div className="TSBG-list-item-checkmark-div">
        <div className="TSBG-list-item-checkmark"></div>
      </div>
    </div>
  )

  const crossmark = (
    <div className="TSBG-list-item-crossmark">&times;</div>
  )

  const divClassName = "TSBG-list-item TSBG-list-item-" + (number % 2 == 0 ? "e" : "o");

  return (
    <div className={divClassName}>
      <span className="TSBG-list-item-baseline">
        <span className="TSBG-list-item-number"> {number > 9 ? '' : '\u00A0'} {number}. {'\u00A0'} </span>
        <QuestionPreviewText text={text} />
      </span>
      <div className="TSBG-list-item-checks">
        {userCorrect === "none" ? <div className="TSBG-list-item-empty"></div> : (userCorrect ? checkmark : crossmark)}
        {multiplayer ? (enemyCorrect === "none" ? <div className="TSBG-list-item-empty"></div> : (enemyCorrect ? checkmark : crossmark)) : null}
      </div>
  </div>
  )
}

function QuestionList(props) {
  const mode = props.mode;
  const list = props.list;
  const size = (mode === "online" && props.list.length == 11) ? 11 : 10;

  let accum = [];
  list.forEach(e => {
    const props = {
      mode: mode,
      key: e["questionNumber"],
      number: e["questionNumber"],
      text: e["question"],
      userCorrect: "userCorrect" in e ? e["userCorrect"] : "none",
      enemyCorrect: "enemyCorrect" in e ? e["enemyCorrect"] : "none"
    }
    const item = <QuestionListItem {...props} /> 
    accum.push(item);
  })

  for (let i = list.length + 1; i <= size; i++) {
    const props = {
      mode: mode,
      key: i,
      number: i
    }
    const item = <QuestionListItem {...props} /> 
    accum.push(item);
  }

  return (
    <div >
      {accum}
    </div>
  )
}

function ACSChange(props) {
  const change = "change" in props ? props.change : "none";

  if (change === "none") {
    return <span className={"TSBG-header-acschange-zero"}>&nbsp;&nbsp;</span>
  }

  if (change > 0) {
    return (
      <span className={"TSBG-header-acschange-positive"}>+{change}</span>
    )
  } else if (change == 0) {
    return (
      <span className={"TSBG-header-acschange-zero"}>+0</span>
    )
  } else {
    return (
      <span className={"TSBG-header-acschange-negative"}>{change}</span>
    )
  }
}

export default function TriviaSidebar(props) {
  const handleModeSelect = props.handleModeSelect;
  const score = "score" in props ? props.score : {user:0, enemy:0};
  const list = props.list;
  const mode = props.mode;
  const username = props.username;
  const acsChange = "acsChange" in props ? props.acsChange : {user:"none", enemy:"none"};
  const ppurl = "ppurl" in props ? props.ppurl : {user: "", enemy: ""};
  const nav = mode === "nav";
  // const acs = props.gameOver ? props.finalACS : 
  //   ("initialACS" in props ? props.initialACS : {user:"", enemy:""});
  
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
  
  const [activeTimers, setActiveTimers] = useState({});
  const [onlineTime, NewOnlineValue] = useState();
  const [singleTime, NewSingleValue] = useState();
  const [sendTime, NewSendValue] = useState();
  const [practiceTime, NewPracticeValue] = useState();

  var counter = 3;

  const handleClickOnline = e => {
    e.stopPropagation();
    clearTime();
    resetCountDown();
    var Timer = setInterval(() => handleModeWithDelay("online", Timer), 1000);
    setActiveTimers(Timer);
  }

  const handleClickSingle = e => {
    e.stopPropagation();  
    clearTime();
    resetCountDown();
    var Countdown = setInterval(() => showCountDown("single", Countdown), 1000);
    showCountDown("single", Countdown)
    var Timer = setInterval(() => handleModeWithDelay("singlePlayer", Timer), 3000);
    setActiveTimers({CountDown: Countdown, Timer: Timer});
  }

  const handleClickSend = e => {
    e.stopPropagation();
    clearTime();
    resetCountDown();
    var Countdown = setInterval(() => showCountDown("send", Countdown), 1000);
    showCountDown("send", Countdown)
    var Timer = setInterval(() => handleModeWithDelay("send", Timer), 3000);
    setActiveTimers({CountDown: Countdown, Timer: Timer});
  }

  const handleClickSolo = e => {
    e.stopPropagation();
    clearTime();
    resetCountDown();
    var Countdown = setInterval(() => showCountDown("practice", Countdown), 1000);
    showCountDown("practice", Countdown)
    var Timer = setInterval(() => handleModeWithDelay("practice", Timer), 3000);
    setActiveTimers({CountDown: Countdown, Timer: Timer});
  }

  const handleModeWithDelay = (mode, timer) => {
    handleModeSelect(mode);
    clearInterval(timer);
  }

  const showCountDown = (mode, timer) => {
    if (mode == "single") {
      NewSingleValue(counter);
      if (counter > 0)
        counter -= 1;
      else {
        clearInterval(timer);
        resetCountDown();
      }
    }
    else if (mode == "send") {
      NewSendValue(counter);
      if (counter > 0)
        counter -= 1;
      else {
        clearInterval(timer);
        resetCountDown();
      }
    }
    else if (mode == "practice") {
      NewPracticeValue(counter);
      if (counter > 0)
        counter -= 1;
      else {
        clearInterval(timer);
        resetCountDown();
      }
    }
  }

  const resetCountDown = () => {
    NewOnlineValue();
    NewSingleValue();
    NewSendValue();
    NewPracticeValue();
    counter = 3;
  }

  const clearTime = () => {
    clearInterval(activeTimers.Timer);
    clearInterval(activeTimers.CountDown);
  }

  const QList = <QuestionList {...props} />

  const handleClickName = (user) => {window.open('/profile/' + user)}

  const userHeaderSection = (
    <div className="TSBG-header-block TSBG-header-us">
      <span className="TSBG-header-username">
        <span onClick={() => handleClickName(username.user)}>{username.user}</span> &nbsp;
        <span className="TSBG-header-acs">({acs != null ? acs.user : "-"})</span>
        &nbsp;
        <ACSChange change={acsChange.user} />
      </span>
      <ProfilePicture scale={1.5} url={ppurl.user} username={username.user}/>
      <label className="TSBG-header-score">{score.user}</label>
    </div>
  );

  const enemyHeaderSection = mode === "online" ? (
    <div className="TSBG-header-block TSBG-header-them">
      <span className="TSBG-header-username">
        <span onClick={() => handleClickName(username.enemy)}>{username.enemy}</span> &nbsp;
        <span className="TSBG-header-acs">({acs != null ? acs.enemy : "-"})</span>
        &nbsp;
        <ACSChange change={acsChange.enemy} />
      </span>
      <ProfilePicture scale={1.5} url={ppurl.enemy} username={username.enemy}/>
      <label className="TSBG-header-score">{score.enemy}</label>
    </div>
  ) : null;

  const userListIcon = (
    <div className="TSBG-list-icon-div">
      <img className="TSBG-list-icon" src={ppurl.user}></img>
    </div>
  );

  const enemyListIcon = mode === "online" ? (
    <div className="TSBG-list-icon-div TSBG-list-icon-div-2">
      <img className="TSBG-list-icon" src={ppurl.enemy}></img>
    </div>
  ) : null;

  if (nav) {
    return (
      <div className="TSB-div">
        <div className="TSB-header">
          <span className="TSB-header-text">Trivia!</span>
          <div className="TSB-header-icon"></div>
        </div>
        <div className="TSB-direct-div">
          <div className="TSB-direct-item" onClick={handleClickOnline}>
            <div className="TSB-direct-icon TSB-direct-icon-online"></div>
            <span className="TSB-direct-text">Play Online</span>
            <span className="TSB-direct-timer">{onlineTime}</span>
          </div>
          <div className="TSB-direct-item" onClick={handleClickSingle}>
            <div className="TSB-direct-icon TSB-direct-icon-single"></div>
            <span className="TSB-direct-text">Single Player</span>
            <span className="TSB-direct-timer">{singleTime}</span>
          </div>
          {/* <div className="TSB-direct-item" onClick={handleClickSend}>
            <div className="TSB-direct-icon TSB-direct-icon-send"></div>
            <span className="TSB-direct-text">Send a Challenge</span>
            <span className="TSB-direct-timer">{sendTime}</span>
          </div>
          <div className="TSB-direct-item" onClick={handleClickSolo}>
            <div className="TSB-direct-icon TSB-direct-icon-solo"></div>
            <span className="TSB-direct-text">Practice</span>
            <span className="TSB-direct-timer">{practiceTime}</span>
          </div> */}
        </div>
        <div className="TSB-temporaryDiv"></div>
      </div>  
    )
  } else {
    if("online".localeCompare(mode) == 0){
      return (
        <div className="TSB-div">
          <div className="TSBG-header">
            {userHeaderSection}
            {enemyHeaderSection}
            {/* <span style={{color: "white"}}> Winner: {props.winner} </span> */}
          </div>
          
          <div className="TSBG-list">
            <div className="TSBG-list-icons-div">
              <div className="TSBG-list-icons">
                {userListIcon}
                {enemyListIcon}
              </div>
            </div>
            
            {QList}
          </div>
        </div>
      )
    }
    else {
      return (
      <div className="TSB-div">
          <div className="TSBG-header">
            {userHeaderSection}
          </div>
          
          <div className="TSBG-list">
            <div className="TSBG-list-icons-div">
              <div className="TSBG-list-icons">
                {userListIcon}
              </div>
            </div>

            {QList}
          </div>
        </div>
      )
    }
  }
}
