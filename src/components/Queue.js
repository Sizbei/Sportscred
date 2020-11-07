import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import Header from './Header';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import '../styling/queue.css';

export default function Queue(props) {
  // const queueActive = "queueActive" in props ? props.queueActive : false;
  // console.log(props);
  const handleCloseQueue = props.handleCloseQueue;
  const handleMatchId = props.handleMatchId;
  const [inQueue, setInQueue] = useState(false); // in queue?
  const [waitConfirm, setWaitConfirm] = useState(false); // can confirm?
  const authContext = useContext(AuthContext);

  const joinQueue = (e) => {
    axios.post("/trivia/head-to-head/joinQueue", { username: authContext.user.username, acs: 1 })
      .then(data => {
        console.log("GOT", data);
        console.log("joining queue");
        setInQueue(true);
      }).catch(data => {
        console.log("ERROR in joining", data);
      })
  }

  const findMatch = () => {
    if (!inQueue) {
      return;
    }

    axios.put("/trivia/head-to-head/findMatch", { username: authContext.user.username, acs: 1 })
      .then(data => {
        if (data.data === "not found") {
          
        } else {  
          console.log("data", data);
          // console.log("done", data.data.user);
          setInQueue(false);
          setWaitConfirm(true);
        }
      }).catch(() => {
        console.log("error");
      })
  }

  const leaveQueue = (e) => {
    console.log("Toggle off.");

    setInQueue(false);
    setWaitConfirm(false);

    axios.delete('/trivia/head-to-head/leaveQueue/' + authContext.user.username)
      .then(data => {
        console.log("Left the queue.");
      }).catch(() => {
        console.log("error leaving queue.");
      })
  }
  
  const confirmMatch = () => {
    console.log("CLICKLED CONFIRMED!", waitConfirm);

    var text = document.getElementsByClassName('queue-text');
    text[0].innerHTML = "Match Accepted!";
    axios.post("/trivia/head-to-head/createGame", { username: authContext.user.username, acs: 1 })
      .then(data => {
        console.log("GOT", data);
        if (data.data == "Match Declined" || data.data == "not found" || data.data == "Unable to join game" || !("_id" in data.data)) {
          console.log("resume queue");
          setInQueue(true);
          setWaitConfirm(false);
        } else {
          setInQueue(false);
          setWaitConfirm(false);
          handleMatchId(data.data._id);
        }
      }).catch(data => {
        console.log("ERROR in confirming", data);
        setInQueue(false);
        setWaitConfirm(false);
      })
  }

  // while in queue, keep checking
  useEffect(() => {
    if (inQueue) {
      const interval = setInterval(() => {
        findMatch();
      }, 200);
      return () => clearInterval(interval);
    }
  }, [inQueue])

  // when component mounted, enter queue
  useEffect(() => {
    joinQueue();
    //return leaveQueue();
  }, [])

  return(
    <div>
      <div className='queue-popup' onClick={() => {leaveQueue(); handleCloseQueue();}} />
        <div className='queue-popup_inner'>
          <label className='queue-text'>{inQueue ? "Finding Opponent..." : "Match Found!"}</label>
          <br></br>
          {(waitConfirm && !inQueue) ? <button className="queue-Confirm" onClick={confirmMatch}>ACCEPT</button> : null}
      </div>
    </div>
  );
}