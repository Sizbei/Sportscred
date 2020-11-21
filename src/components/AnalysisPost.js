import React, {Component, useEffect, useState, useContext} from 'react';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import '../styling/Analysis.css';


export default function AnalysisPost(props) {

  const [tier, setTier] = useState("");
  const [post, setPost] = useState(props.post);
  const [timeLeft, setTimeLeft] = useState([0,0])
  const handlePostClick = props.handlePostClick;

  useEffect(() => {
    
    try {

      setPost(props.post);
      setTier(post.tier);

      const endTime = new Date(post.endTime);
      const curTime = new Date();

      const timeDiff = endTime - curTime;

      if(timeDiff > 0){
        const hours = Math.floor(Math.abs(timeDiff / 36e5));
        const minutes = Math.floor(Math.abs((timeDiff - hours * 36e5) /  60000))
        
        setTimeLeft([hours, minutes]);
      }


    } catch(err) { console.log(err)}


  }, [props.post]);

  const handleClick = (event, value) => {
    handlePostClick(event, value, post);
  }

  return(
    <div className="analysis-post-container" onClick={(event, value) => handleClick(event, value)}>
      <div className="analysis-post-front">
        <div className={`${tier === 'Expert Analyst' ? 'expert-analyst-div' : 
                          (tier === 'Pro Analyst' ? 'pro-analyst-div' : 
                          (tier === 'Analyst' ? 'analyst-div' : 
                          (tier === 'Fanalyst' ? 'fanalyst-div' : '')))} tier-div`} >{tier}</div>

        <div className="analysis-question">{post.question}</div>
      </div>

      
      {post.status === "open" ? <div className="time-left">
        <div className="clockIcon">
          <AccessTimeIcon />
        </div>
        <div className="time">
          Closes in: &ensp; {timeLeft[0]}h {timeLeft[1]}m
        </div>
      </div> : null}
    </div>
  );
    
}