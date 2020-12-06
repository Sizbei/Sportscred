import React, {useState,  useEffect} from "react"
import '../styling/PlayOffPrediction.css'
import TeamBox from './TeamBox'
 
export default function PlayOffPrediction(props) {
    console.log('GOT', props);

    const data = props.data;
    const games = data.games;
    const matchIds = props.matchIds;
    const onClick = props.onClick;
    const images = props.images;
    const teamA = data.teams[0];
    const teamB = data.teams[1];
    const scoreA = data.score[0];
    const scoreB = data.score[1];
    const predictions = props.predictions;

    var results = "results" in props ? props.results : "Pending";
    const teamClassName = (index) => {
        const base = "team" + (index + 1) + "Box";
        return base;
    }

    const darkenOtherBox = (indexOpposite, indexClicked) => {
       document.getElementsByClassName("team" + indexOpposite + "Box")[0].style = "filter: brightness(50%)";
       document.getElementsByClassName("team" + indexClicked + "Box")[0].style = "filter: brightness(100%)";
    }

    useEffect(() => {
      console.log("GOT PREDICTIONS", predictions);
      predictions.forEach((el, i) => {
        console.log(el, i);
        if (i >= games.length) return;

        if (el === "") {
          document.getElementsByClassName("team" + (i + 1) + "Box")[0].style = "filter: brightness(50%)";
          document.getElementsByClassName("team" + (i + 1.5) + "Box")[0].style = "filter: brightness(50%)";
        } else if (el === teamA) {
          darkenOtherBox(i+1.5, i+1);
        } else if (el === teamB) {
          darkenOtherBox(i+1, i+1.5)
        }
      })
    }, [predictions])

    const imageA = teamA in images ? images[teamA] : "";
    const imageB = teamB in images ? images[teamB] : "";

    const initstyle = {
      filter: "brightness(50%)",
    }
    return (
      <div className="predictionBox-popup" onClick={() => onClick("close")}>
        <div className="predctionBox-popup_inner" onClick = {(e) => { e.stopPropagation(); }}>
          <div className="center-predictionBox">
              <div className="predictionBox"> 
                    <div className="predictionHeader">
                        <div className="predictionLeft">
                            <label className='predictionScore'>{scoreA}</label>
                
                            <label className='predictionTeamName'> {teamA}</label>
                        </div>
                        <div className="predictionVS">
                            <label className='predictionVersus'>vs</label>
                        </div>
                        <div className='predictionRight'>
                            <label className='predictionTeamName'> {teamB}</label>
                            <label className='predictionScore'>{scoreB}</label>
                        </div>
                    </div>
                    <div className="align-result-right">
                        <label className="predictionResult">Result</label> 
                    </div>
                  {games.map((data, index) => {
                      let result = null;
                      if (results[index] !== "") {
                        result = <TeamBox name={results[index]} height='4vw' width='12vw' image={images[results[index]]}></TeamBox>
                      } else {
                        result = <div> Pending </div>
                      }
                      return (
                          <div className="gamePredictionBox">
                              <div className="gameNumber">Game {index + 1}</div>
                              <div className='predictTeams'>
                                  <div className={teamClassName(index)} style={initstyle} onClick={() => {onClick({index: index, gameId: data, team: teamA});}}>
                                      <TeamBox name={teamA} height='4vw' width='12vw' image={imageA}></TeamBox>
                                  </div>
                                  <div className='spaceAllotted'></div>
                                  <div className={teamClassName(index+0.5)} style={initstyle} onClick={() => {onClick({index: index, gameId: data, team: teamB});}}>
                                      <TeamBox name={teamB} height='4vw' width='12vw' image={imageB}></TeamBox>
                                  </div>
                              </div>
                              <div className="resultPredictionImage">
                                {result}
                              </div>    
                          </div>
                      );
                  })}
              </div>
          </div>
        </div>
      </div>
    );
}