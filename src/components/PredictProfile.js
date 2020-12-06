import React, {useState,  useEffect, useContext} from "react"
import {AuthContext} from '../Context/AuthContext';
import Pagination from "@material-ui/lab/Pagination";
import "../styling/PredictProfile.css";
import TeamBox from './TeamBox'; 
import "../styling/IndvPrediction.css";

export default function PredictProfile(props) { 
  
  const [currentMatches, setCurrentMatches] = useState([]); 

  const [currentPage, setCurrentPage] = useState(1); 
  const [total, setTotal] = useState(0); 
  const authContext = useContext(AuthContext); 
  const [type, setType] = useState("current"); 
  const [currentSelection, setCurrentSelection] = useState([]); 
  const [waitingLoad, setWaitingLoad] = useState(true); 
  const [currentLoad, setCurrentLoad] = useState(true); 

  const getSeasonals = async (page, list, initialLoad) => { 
    if (initialLoad) {
      await fetch("/prediction/season" + props.currPath).then(res => res.json())
      .then (data=> {
        setTotal(data.Seasonals.length); 
        setCurrentMatches(data.Seasonals);
        //console.log(page); 
        setCurrentSelection(data.Seasonals.slice(page*3 - 3, page*3 )); 
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
  const getCurrent = (page, list) => {
    const indexOfLastPost = page * 3; 
    const indexOfFirstPost = indexOfLastPost - 3; 
    const selection = list.slice(indexOfFirstPost, indexOfLastPost);
    setCurrentSelection(selection); 
  }
  useEffect(() => {
    
      getSeasonals(currentPage, currentMatches ,currentLoad); 
    
  }, [currentPage])

  
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage); 
  }



  return (
    waitingLoad ?
      <div> <h1>Loading ...</h1>  </div>
      :
      <div className="pp-background">
        <div className="pp-full-container">

          <div>
            <div className="pp-matches-container">
              {currentSelection.map((data, index) => {
                return (
                  <div className="pp-match">
                    <div className="pp-match-date"> 
                    <label className="pp-date-label"> {"DATE: " + data.gameDay.substring(0, 10)} </label>
                    </div>
                    <div className="pp-match-row-container">

                      <div className="pp-matches-info">
                        <button className={data.pick === null ? "pp-matches-info-button"
                          : data.pick === data.team1Name ? (type === "current" ? "pp-matches-info-button-selected" : (data.pick === data.result ? "pp-matches-info-button-correct" : "pp-matches-info-button-incorrect"))
                            : "pp-matches-info-button"}
                        ><TeamBox name={data.team1Name} image={data.team1Image} /></button>
                        <label className="pp-vs-label"> VS </label>
                        <button className={data.pick === null ? "pp-matches-info-button"
                          : data.pick === data.team2Name ? (type === "current" ? "pp-matches-info-button-selected" : (data.pick === data.result ? "pp-matches-info-button-correct" : "pp-matches-info-button-incorrect"))
                            : "pp-matches-info-button"}
                        ><TeamBox name={data.team2Name} image={data.team2Image} /></button>
                      </div>
                    </div>
                </div>
                )
              })}
            </div>
            <div className="pp-pagination" >
            <Pagination className="MuiPagination-ul" color="primary" count={Math.ceil(total / 3)} onChange={handlePageChange} />
            </div>
          </div>
        </div>
      </div>
  )

}