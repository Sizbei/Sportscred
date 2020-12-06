import React, {useState,  useEffect, useContext} from "react"
import {AuthContext} from '../Context/AuthContext';
import Pagination from "@material-ui/lab/Pagination";
import "../styling/IndvPrediction.css";
import TeamBox from './TeamBox'; 

export default function PickHistoryView (props) {
  const authContext = useContext(AuthContext); 
  const [pastLoad, setPastLoad] = useState(true); 
  const [weekSelected, setWeekSelected] = useState(-1); 
  const [finishedMatches, setFinishedMatches] = useState([]); 
  const [currentSelection, setCurrentSelection] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [waitingLoad, setWaitingLoad] = useState(true); 
  const [total, setTotal] = useState(0);
  

  const getPastHistory = async (page , list, initialLoad, week) => {
    if (initialLoad) {
      await fetch("/prediction/season/week/" + week).then(res => res.json()) 
      .then (data=> {
        setCurrentPage(1); 
        setTotal(data.Seasonals.length); 
        setFinishedMatches(data.Seasonals); 
        setCurrentSelection(data.Seasonals.slice(page*10 - 10, page*10)); 
        //console.log(data.Seasonals);
        setPastLoad(false);
        setWaitingLoad(false); 
      })
      .catch((error) => {
        console.log(error); 
      })
    }
    else {
      getCurrent(page, list); 
      setWaitingLoad(false); 
      
    }
  }
  const getCurrent = (page, list) => {
    const indexOfLastPost = page * 10; 
    const indexOfFirstPost = indexOfLastPost - 10; 
    const selection = list.slice(indexOfFirstPost, indexOfLastPost);
    setCurrentSelection(selection); 
  }
  useEffect(() => {
      getPastHistory(currentPage, finishedMatches, pastLoad, weekSelected);
      console.log(finishedMatches); 
    
  }, [currentPage, weekSelected])
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage); 
    console.log(currentSelection); 
  }
  const handleWeekChange = ( type) => {
    if (type === "forward") {
      if (weekSelected < -1 ) { 
        setWeekSelected(weekSelected + 1);  
        setPastLoad(true);  
        setWaitingLoad(true);     
      }
    }
    else {
      setWeekSelected(weekSelected - 1);     
      setPastLoad(true); 
      setWaitingLoad(true); 
    }
  } 

  const redirect= () => {
    props.history.push('/ip');
    window.location.reload(); 
  }
  return (
    waitingLoad ? 
     <div> <h1>Loading ...</h1>  </div>
    : 
    <div className="ip-background">
    <div className="ip-full-container">
      <button onClick={() => redirect()}className="ip-redirect-button"> Individual Picks </button>
      <div className="ip-header-section">
       
        <div className="ip-week-redirect">
          <button onClick={()=>handleWeekChange("forward")}className="ip-navigation-buttons"> {"<"}</button>
          <label>{weekSelected === 0? "This Week" : -1 * weekSelected + " week(s) ago"}</label>
          <button onClick={()=>handleWeekChange("back")} className="ip-navigation-buttons"> {">"}</button>        
        </div> 
      </div>
      
      <div className="ip-matches-container">
            {currentSelection.map((data,index) => { 
              return(
                <div className="ip-match-row-container">
                  <label className="ip-date-label"> {data.gameDay.substring(0,10)} </label>
                  <div className="ip-matches-info">
                    <button className={data.pick === null?  "ip-matches-info-button"
                                      :data.pick === data.team1Name?  (data.pick === data.result ? "ip-matches-info-button-correct" : "ip-matches-info-button-incorrect")
                                      : "ip-matches-info-button" }><TeamBox name={data.team1Name} image={data.team1Image}/></button>
                    <label className="ip-vs-label"> VS </label>
                    <button className={data.pick === null?  "ip-matches-info-button"
                                      :data.pick === data.team2Name? (data.pick === data.result ? "ip-matches-info-button-correct" : "ip-matches-info-button-incorrect") 
                                      : "ip-matches-info-button" }><TeamBox name={data.team2Name} image={data.team2Image}/></button>
                  </div>
                </div>
            
            )})}
          </div>
          <Pagination className="MuiPagination-ul" color="primary" count={Math.ceil(total/10)} onChange={handlePageChange} />
    </div>
    </div>
  )
}