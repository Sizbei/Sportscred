import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import  '../styling/InGameTrivia.css';
import TriviaSidebar from './TriviaSidebar';
import ProfilePicture from './ProfilePicture';
import crown from '../res/images/crowns.png'
import PostTrivia from './PostTrivia'

export default function InGameTrivia(props) {
  const mode = props.mode;
  const previousAnswer = props.previousAnswer;
  const handleOptionSelect = props.handleOptionSelect;
  const handleModeSelect = props.handleModeSelect;
  const chosenOptions = "chosenOptions" in props ? props.chosenOptions : {user: "", enemy: ""};
  const endState = "gameOver" in props && props.gameOver && (props.stop == "single-done" || props.stop == "online-done"); // show nav buttons?
  const [hideNavPopup, setHideNavPopup] = useState(false);
  const showNavButtons = endState && hideNavPopup;

  let currentQuestion = '\u00A0'; // initialize with space to preserve spacing
  let options = ['\u00A0', '\u00A0', '\u00A0', '\u00A0'];
  if (mode == "singlePlayer" || mode == "online") {
    currentQuestion = "currentQuestion" in props ? props.currentQuestion : currentQuestion;
    options = "options" in props ? props.options : options;
  }

  const winner = (function() {
    if (props.mode != "online") {
      return "not applicable";
    }
    
    if (props.gameOver) {
      if (props.score.user > props.score.enemy) {
        return "user";
      } else if (props.score.user == props.score.enemy) {
        return "tie";
      } else {
        return "enemy";
      }
    } else {
      return "none";
    }
  })();
  
  const [tickValue, NewTickValue] = useState(0);
  const [opacityValue, NewOpacityValue] = useState(100);
  const [timeValue, NewTimeValue] = useState(10);
  const [activeTimers, setActiveTimers] = useState({});
  
  var timerOn = false;
  var tickJSON = { 
    width: tickValue + "%"
  }
  var opacityJSON = {
    opacity: opacityValue + "%"
  }

  const triviaClockTick = (timeAllotted=10, setOpacity=100, setTick=0) => {
    timerOn = true;
    var flashOn = true;
    var tick = setTick;
    var opacity = setOpacity;
    var counter = timeAllotted;
    NewTimeValue(counter);
    const start = new Date();
    var Timer = setInterval(() => triggerTicker(), 1);
    const clockInterval = setInterval(() => triggerCountDown(), 1000);
    function triggerTicker() {
      if (timerOn) {
          tick = 100 * (new Date() - start) / (timeAllotted * 1000);
          NewTickValue(tick);
          if (opacity > 100) 
              opacity = 100;
          if (opacity < 0)
              opacity = 0;
          NewOpacityValue(opacity);
          if (Math.trunc(tick) % 4 == 0)
              flashOn = true;
          else
              flashOn = false;
          if (tick >= 60 && !flashOn)
              opacity -= 0.6;
          else if (tick >= 60 && flashOn)
              opacity += 1.5;
      }
    }
    function triggerCountDown() {
      if (counter == 0) {
        stopTimers();
        handleOptionSelect(null); 
      } else if (counter > 0) {
        counter -= 1;
        NewTimeValue(counter);
      } else {
        clearInterval(clockInterval);
      }
    }

    return {clockInterval: clockInterval, Timer: Timer};
  }

  const stopTimers = () => {
    // Clear previous intervals
    clearInterval(activeTimers.Timer);
    clearInterval(activeTimers.clockInterval);
  }

  // stopTimers() should be called before this function is called
  // otherwise it is a seizure simulation
  const reset = () => { 
    timerOn = false;
    NewOpacityValue(100);
    NewTickValue(0);
    NewTimeValue(10);
  }

  // Stop timers
  useEffect(() => {
    if (!("stop" in props) || props.stop === "nostop" || (props.mode === "online" && props.select === null)) {
      return;
    }

    stopTimers();
    NewTickValue(100);
    if ("online".localeCompare(mode) == 0) {
        NewTimeValue("Waiting for other User...");
    }

    if (props.stop === "toNav") {
      reset();
    }
  }, [props.stop])


  // Reset timers on each new question
  useEffect(() => {
    if (!("questionCount" in props)) {
      return;
    }
    console.log("questionCount", props.questionCount);
    stopTimers();
    reset();
    var newActiveTimers;
    if ("singlePlayer".localeCompare(mode) == 0) {
        newActiveTimers = triviaClockTick(14, 100, 0);
    }
    else {
        newActiveTimers = triviaClockTick(10, 100, 0);
    }
    setActiveTimers(newActiveTimers);

    return () => {
      clearInterval(newActiveTimers.Timer);
      clearInterval(newActiveTimers.clockInterval);
    }
  }, [props.questionCount])

  
  const boxClassName = (index) => {
    const base = "answer" + (index + 1) + "Box";
    
    if (chosenOptions.user === options[index]) {
      return (chosenOptions.user === options[index] ? base + '-hover' : '')
    } else if (chosenOptions.user === "") {
      return base;
    } else { // aka wrong answer
      return base + "-nohover"
    }
  }

  const handleClosePostTrivia = () => {
    setHideNavPopup(true);
  }

  // show post trivia on finalState = true
  useEffect(() => {
    if (endState) {
      setHideNavPopup(false);
    } else {
      setHideNavPopup(true);
    }
  }, [endState])

  const timeClassName = timeValue == "Waiting for other User..." ? "trivia-wait" : "timeValue"

  return(
      <div className='trivia-background'>
        <div className='left-segment'>
        <div className='timeBox'>
            <label className={timeClassName}>{mode != "nav" ? timeValue : null}</label>
        </div>
        <div className='clockRed'>
            <div className='clockTick' style={tickJSON}></div>
            <div className='clock' style={opacityJSON}>
            </div>
        </div>
        <div className='questionBox'>
          <label id='question'>{currentQuestion}</label>
        </div>
        <div className='answers'>
          <div className='leftAnswers'>
              <div className={boxClassName(0)} onClick={() => handleOptionSelect(0)}> 
                  <div className="answer-icons-div">
                    <div className='crown-icon-div'>
                      {previousAnswer === options[0] ? <img className="crown-icon" src={crown}></img> : null}
                    </div>
                    <div className="answer-icons">
                      {chosenOptions.user === options[0] ? <img className="answer-icon" src={props.ppurl.user}></img> : null}
                      {chosenOptions.enemy === options[0] ? <img className="answer-icon" src={props.ppurl.enemy}></img> : null}
                    </div>
                  </div>
                  <div className='answer-div'>
                    <label className='answer1'>{options[0]}</label>
                  </div>
              </div>
              <div className={boxClassName(1)} onClick={() => handleOptionSelect(1)}>
                  <div className="answer-icons-div">
                    <div className='crown-icon-div'>
                      {previousAnswer === options[1] ? <img className="crown-icon" src={crown}></img> : null}
                    </div>
                    <div className="answer-icons">
                      {chosenOptions.user === options[1] ? <img className="answer-icon" src={props.ppurl.user}></img> : null}
                      {chosenOptions.enemy === options[1] ? <img className="answer-icon" src={props.ppurl.enemy}></img> : null}
                    </div>
                  </div>
                  <div className='answer-div'>
                    <label className='answer2'>{options[1]}</label>
                  </div>
              </div>
          </div>
          <div className='rightAnswers'>
              <div className={boxClassName(2)} onClick={() => handleOptionSelect(2)}>
                  <div className="answer-icons-div">
                    <div className='crown-icon-div'>
                      {previousAnswer === options[2] ? <img className="crown-icon" src={crown}></img> : null}
                    </div>
                    <div className="answer-icons">
                      {chosenOptions.user === options[2] ? <img className="answer-icon" src={props.ppurl.user}></img> : null}
                      {chosenOptions.enemy === options[2] ? <img className="answer-icon" src={props.ppurl.enemy}></img> : null}
                    </div>
                  </div>
                  <div className='answer-div'>
                    <label className='answer3'>{options[2]}</label>
                  </div>
              </div>
              <div className={boxClassName(3)} onClick={() => handleOptionSelect(3)}>
                  <div className="answer-icons-div">
                    <div className='crown-icon-div'>
                        {previousAnswer === options[3] ? <img className="crown-icon" src={crown}></img> : null}
                    </div>
                    <div className="answer-icons">
                      {chosenOptions.user === options[3] ? <img className="answer-icon" src={props.ppurl.user}></img> : null}
                      {chosenOptions.enemy === options[3] ? <img className="answer-icon" src={props.ppurl.enemy}></img> : null}
                    </div>
                  </div>
                  <div className='answer-div'>
                    <label className='answer4'>{options[3]}</label>
                  </div>
              </div>
          </div>
        </div>

        {showNavButtons ? (
          <div className="post-nav-trivia">
            <button className="post-nav-button" onClick={() => handleModeSelect("playAgain")}>
              <label className="post-nav-button-label">Play Again</label>
            </button>
            <button className="post-nav-button" onClick={() => handleModeSelect("nav")}>
              <label className="post-nav-button-label">Select Mode</label>
            </button>
          </div>
        ) : null}
      </div>

    <div className='right-segment'>
      <TriviaSidebar {...props} handleModeSelect={handleModeSelect} winner={winner} />
    </div>
    
    {endState && !hideNavPopup ? (
      <div className="post-trivia-div">
        <PostTrivia handleClosePostTrivia={handleClosePostTrivia} {...props} winner={winner} />
      </div>
    ) : null}
    
    </div>
  );
}