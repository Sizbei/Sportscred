import React, {useState,  useEffect, useContext} from "react"
import {AuthContext} from '../Context/AuthContext';
import Pagination from "@material-ui/lab/Pagination";
import "../styling/IndvPrediction.css";
import TeamBox from './TeamBox'; 

export default function PredictionsView(props) { 
  const [currentMatches, setCurrentMatches] = useState([]); 
  const [finishedMatches, setFinishedMatches] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [total, setTotal] = useState(0); 
  const authContext = useContext(AuthContext); 
  const [type, setType] = useState("current"); 
  const [currentSelection, setCurrentSelection] = useState([]); 
  const [waitingLoad, setWaitingLoad] = useState(true); 
  const [currentLoad, setCurrentLoad] = useState(true); 
  const [pastLoad, setPastLoad] = useState(true); 
  const getSeasonals = async (page, list, initialLoad) => { 
    if (initialLoad) {
      await fetch("/prediction/season/current").then(res => res.json())
      .then (data=> {
        setCurrentPage(1); 
        setTotal(data.currentSeasonals.length); 
        setCurrentMatches(data.currentSeasonals);
        //console.log(page); 
        setCurrentSelection(data.currentSeasonals.slice(page*10 - 10, page*10 )); 
        setCurrentLoad(false);
        setWaitingLoad(false); 
        //console.log(list);
        
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
  const getPast = async (page, list, initialLoad) => {
    
    if (initialLoad) {
      await fetch("/prediction/season/past").then(res => res.json()) 
      .then (data=> {
        setCurrentPage(1); 
        setTotal(data.pastSeasonals.length); 
        setFinishedMatches(data.pastSeasonals); 
        setCurrentSelection(data.pastSeasonals.slice(page*10 - 10, page*10)); 
        //console.log(data.pastSeasonals);
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
    if (type === "current") {
      getSeasonals(currentPage, currentMatches ,currentLoad); 
    }
    else if (type === "past") {
      getPast(currentPage, finishedMatches, pastLoad);
    }
    
  }, [currentPage, type, pastLoad, currentLoad])

  
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage); 
    //console.log(currentMatches); 
  }

  const handleSelection= (data, teamName,index) => { 
    //console.log("match: " + matchId + "\nteamname:" + teamName);
    if (type === "current") {
      const body = {
        _id: data._id,
        pick: teamName, 
      }
      fetch('/prediction/addPrediction', {
        method :  "PUT",
        body : JSON.stringify(body),
        headers: {
            'Content-Type' : 'application/json'
        }
      }).then(res => res.json())
      .then (updatedData => {
        
        const updatedEntry = {
          "gameDay": data.gameDay,
          "pick": teamName,
          "result": data.result,
          "team1Image": data.team1Image,
          "team1Name": data.team1Name,
          "team2Image": data.team2Image,
          "team2Name": data.team2Name,
          "_id": data._id,
        }
        const newSelection = [
          ...currentSelection.slice(0, index),
          updatedEntry, 
          ...currentSelection.slice(index +1) 
        ]
        const newMatches = [
          ...currentMatches.slice(0, currentPage*10 - 10), 
          ...currentSelection.slice(0, index),
          updatedEntry, 
          ...currentSelection.slice(index +1) ,
          ...currentMatches.slice(currentPage*10)
        ]
        setCurrentSelection(newSelection); 
        setCurrentMatches(newMatches); 
      })
      .catch((error) => { 
        console.log(error); 
      })
    }  
  }
  const onChangeSelect = (e) => {
    if (e.target.value === "Completed Matches") { 
      setType("past"); 
      setPastLoad(true); 
      setWaitingLoad(true); 
    }
    
    else if (e.target.value === "Upcoming Matches") {
      setType("current"); 
      setCurrentLoad(true); 
      setWaitingLoad(true); 
    }
    
  }
  const redirect= () => {
    props.history.push('/ph');
    window.location.reload(); 
  }
  return (
     waitingLoad ? 
     <div> <h1>Loading ...</h1>  </div>
    : 
    <div className="ip-background">
      <div className="ip-full-container">
      <button onClick={() => redirect()}className="ip-redirect-button"> Picks History </button>
        <div className="ip-header-section">
            <select onChange={onChangeSelect} value={type === "current" ?  "Upcoming Matches": "Completed Matches"}>
              <option>  Upcoming Matches </option>
              <option> Completed Matches</option>
            </select>         
        </div>
        <div>
        <div className="ip-matches-container">
            {currentSelection.map((data,index) => { 
              return(
                <div className="ip-match-row-container">
                  <label className="ip-date-label"> {data.gameDay.substring(0,10)} </label>
                  <div className="ip-matches-info">
                    <button className={data.pick === null?  "ip-matches-info-button"
                                      :data.pick === data.team1Name? (type === "current" ? "ip-matches-info-button-selected" : (data.pick === data.result ? "ip-matches-info-button-correct" : "ip-matches-info-button-incorrect")) 
                                      : "ip-matches-info-button" } 
                            onClick={()=>handleSelection(data, data.team1Name, index)}><TeamBox name={data.team1Name} image={data.team1Image}/></button>
                    <label className="ip-vs-label"> VS </label>
                    <button className={data.pick === null?  "ip-matches-info-button"
                                      :data.pick === data.team2Name? (type === "current" ? "ip-matches-info-button-selected" : (data.pick === data.result ? "ip-matches-info-button-correct" : "ip-matches-info-button-incorrect")) 
                                      : "ip-matches-info-button" }  
                            onClick={()=>handleSelection(data, data.team2Name, index)}><TeamBox name={data.team2Name} image={data.team2Image}/></button>
                  </div>
                </div>
            
            )})}
          </div>
          <Pagination className="MuiPagination-ul" color="primary" count={Math.ceil(total/10)} onChange={handlePageChange} />
      </div> 
      </div>
    </div> 
  )

}