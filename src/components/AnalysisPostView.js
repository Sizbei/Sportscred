import React, {useEffect, useContext, useState} from 'react';
import axios from 'axios';
import Header from './Header';
import {AuthContext} from '../Context/AuthContext';
import '../styling/AnalysisPostView.css'
import Slider from './Slider';
import Histogram from './Histogram';

export default function AnalysisPostView(props) {
  const _id = window.location.pathname.split("/").pop();

  const authContext = useContext(AuthContext);
  const [formState, setFormState] = useState("etc");
  const [tier, setTier] = useState("");
  const [response, setResponse] = useState("");
  const [question, setQuestion] = useState("Sample Question to be Answered");
  const [debateHeader, setDebateHeader] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [ourPosts, setOurPosts] = useState([]);
  const [otherPosts, setOtherPosts] = useState([]);
  const [activeForUser, setActiveForUser] = useState(false);

  const restart = () => {
    fetch('/analysis/post/' + _id).then(res => res.json())
    .then((initData) => {
      console.log("got init", initData);
    
      setQuestion(initData.analysis.question);
      setImageUrl(initData.analysis.image);
      console.log("GOT IMAGE", initData.analysis.image);
      setTier(initData.analysis.tier);
      
      const isOpen = initData.analysis.status === "open";
      const containsUser = initData.analysis.isUserInAnalysis;
      setActiveForUser(isOpen && containsUser);

      if (isOpen && !containsUser) {
        setDebateHeader("Daily Debate (LOCKED)")
      }
      else if (isOpen && containsUser) {
        setDebateHeader("Daily Debate");
      }
      else {
        setDebateHeader("Past Debate");
      }
      if (isOpen && containsUser && initData.userPosts.length == 0) {
        setFormState("dailyQuestion");
      } else {
        setOurPosts(initData.userPosts)
        setOtherPosts(initData.otherPosts)
        setFormState("discussion");
      }
    })
  }

  useEffect(() => {
    restart();
  }, [])

  const onSubmit = () => {
    console.log("SUBMIT:", response);

    const requestBody = {
      method: "put",
      body: JSON.stringify({
        _id: _id,
        username: authContext.user.username,
        post: response,
      }),
      headers: {'Content-Type' : 'application/json'}
    }
    console.log("send", requestBody);
    fetch('/analysis/post/', requestBody).then(res => res.json())
    .then((res) => {
      console.log("GOT RESPONSE", res);
      restart();
    })
  }

  const sampleHistogramData = Array(101).fill(0).map((el, i) => i*i + (100-i)*(100-i) - 2 * 50 * 50);
  sampleHistogramData[55] = 50*50*30;

  const sampleHistogramData2 = Array(101).fill(0).map((el, i) => (i-60) * (i-60) + Math.pow(1.1, i));

  const sampleHistogramData3 = Array(101).fill(0).map((el, i) => 10);

  if (formState === "discussion") {
    return(
    <div className='analysis-background'>
      <div className="analysis-header">
        <span>
          <label className="analysis-question-header">{debateHeader} </label>
          <label className="analysis-question-difficulty">{tier}</label>
        </span>
        <label className="analysis-question-text">{question}</label>
        </div>
        <div className="analysis-question-image">
          <img className="analysis-image" src={imageUrl} ></img>
        </div>
        <div className="analysis-comments"> 

        <div className="analysis-posts">
          {ourPosts.map((data, index) => {
            console.log(data);
            return (
              <VotePost us={authContext.user.username === data.user} active={activeForUser} acs={0} timeAgo={data.createdAt} scoreData={data.histogram} {...data}/>
            )
          })}

          {otherPosts.map((data, index) => {
            console.log(data);
            return (
              <VotePost us={authContext.user.username === data.user} active={activeForUser} acs={0} timeAgo={data.createdAt} scoreData={data.histogram} {...data}/>
            )
          })}
        </div>
      </div>
  </div>
    );
  } 
  else if (formState === "dailyQuestion") {
    return(
      <div className='analysis-background'>
        <div className="analysis-header">
        <span>
          <label className="analysis-question-header">{debateHeader} </label>
          <label className="analysis-question-difficulty">{tier}</label>
        </span>
        <label className="analysis-question-text">{question}</label>
        </div>
        <div className="analysis-question-image">
          <img className="analysis-image" src={imageUrl} ></img>
        </div>
        <div className='analysis-response'>
          <label className='analysis-response-header'>Your Response</label>
          <textarea type="text" className="analysis-response-input" maxLength="1000" onChange={e => setResponse(e.target.value)}></textarea>
          <button className='analysis-response-submit' onClick={onSubmit}>Submit</button>
        </div>
      </div>
      );
  } else {
    return null;
  }
} 

function VotePost(props) {
  const _id = props._id;
  const username = props.user;
  const us = "us" in props ? props.us : false;
  const isScored = props.isScored
  const [acs, setACS] = useState("acs" in props ? props.acs : "-");
  var timeAgo = Date.parse(props.timeAgo);
  var timeNow = new Date(Date.now());
  var timeBefore = new Date(timeAgo);
  const [scoreData, setScoreData] = useState(props.scoreData);
  const [scoredHistory, setScoredHistory] = useState(props.scoredHistory);
  const sum = scoreData.reduce((accum, n) => accum + n);
  const averageScore = sum === 0 ? sum : scoreData.reduce((accum, n, i) => accum + i * n / sum);
  const content = props.content;
  const hasBeenVoted = scoreData.reduce((accum, n) => accum + n) != 0
  const active = props.active;
  const showScore = us || scoredHistory != null || !active;
  var updatedTime = "";

//   console.log("timeNow: " + timeNow + "\n" + timeNow.getMonth() + "\n" + timeNow.getDate() + "\nHours: " + timeNow.getHours() + "\n" + timeNow.getMinutes() + "\n");
//   console.log("timeBefore: " + timeBefore + "\n" + timeBefore.getMonth() + "\n" + timeBefore.getDate() + "\nHours: " +  + timeBefore.getHours() + "\n" + timeBefore.getMinutes() + "\n");
//   console.log(timeNow.getHours() > timeBefore.getHours());
  if(timeNow.getMonth() > timeBefore.getMonth()) {
      if (timeNow.getMonth() - timeBefore.getMonth() == 1) {
        updatedTime = "1 month ago";
      }
      else {
        updatedTime = timeNow.getMonth() - timeBefore.getMonth() + " months ago";
      }
  } else if (timeNow.getDate() > timeBefore.getDate()) {
    if (timeNow.getDate() - timeBefore.getDate() == 1) {
        updatedTime = "1 day ago"
    }
    else {
        updatedTime = timeNow.getDate() - timeBefore.getDate() + " days ago";
    }
  } else if (timeNow.getHours() > timeBefore.getHours()) {
    if (timeNow.getHours() - timeBefore.getHours() == 1) {
        updatedTime = "1 hour ago"
    }
    else {
        updatedTime = timeNow.getHours() - timeBefore.getHours() + " hours ago";
    }
  } else if (timeNow.getMinutes() > timeBefore.getMinutes()) {
    updatedTime = timeNow.getMinutes() - timeBefore.getMinutes() + " minutes ago";
  } else {
    updatedTime = " 1 minute ago";
  }

  const handleVote = (score) => {
    console.log("GOT", score);
    
    const requestBody = {
      method: "put",
      body: JSON.stringify({
        user: "user1",
        _id: _id,
        score: score,
      }),
      headers: {'Content-Type' : 'application/json'}
    }
    fetch('/analysis/post/score/', requestBody).then(res => res.json())
    .then((res) => {
      if (res.status != 200) return;
      console.log("GOT RESPONSE", res);

      const newScoreData = Array(101).fill(0).map((el, i) => scoreData[i]);
      newScoreData[score] += 1;
      setScoreData(newScoreData);
      setScoredHistory(newScoreData);
    })
  }

  useEffect(() => {
    fetch( "/profile/" + username + "/acs").then(res => res.json()) 
        .then(data => {
            setACS(data.acsTotal);
        })
  }, [])

  const usernameStyle = {
    color: us ? "crimson" : "white",
  }

  return (
    <div>
      {/* {!us ? (
        <div className="analysis-slider">
          <Slider scale={0.7} onSubmit={handleVote} pastScore={scoredHistory}/>
        </div>
      ) : (
        <div className="analysis-slider" style={{visibility: "hidden"}}>
        </div>
      )} */}

      {us || (!active && scoredHistory == null) ? (
        <div className="analysis-slider" style={{visibility: "hidden"}}>
        </div>
      ) : (
        <div className="analysis-slider">
          <Slider scale={0.7} onSubmit={handleVote} pastScore={scoredHistory}/>
        </div>
      )}
      
      <div className="analysis-user">
        <div className="left-user-info">
          <label className="analysis-username" style={usernameStyle}>{username}</label>
          <label className="analysis-ACS">({acs})</label>
          {/* <div className="analysis-ACS-div">
          </div> */}
          <div className="analysis-histogram">
            {showScore ? <Histogram data={scoreData} xScale={0.4} yScale={0.2}/> : null}
          </div>
          {hasBeenVoted && showScore ? <label className="analysis-average-Score">Average Score: {averageScore}%</label> : null}
          <label className="analysis-time-ago">{updatedTime}</label>
        </div>
        <label className="analysis-additional-comment">{content}</label>
      </div>
    </div>
  )
}
