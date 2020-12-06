import React, {useEffect, useContext, useState} from 'react';
import {AuthContext} from '../Context/AuthContext';
import BracketView from './BracketView.js';
import PlayOffPrediction from './PlayOffPrediction';

export default function BracketController(props) {
  const authContext = useContext(AuthContext);

  const defaultState = "wait";
  const [state, setState] = useState(defaultState);

  const [year, setYear] = useState(2020);

  // the change to the user's acs
  const [acsChange, setAcsChange] = useState('none');

  const [counter, setCounter] = useState(0); // ensure updates for child useEffect so that onClick remains fresh

  const [playOffPrediction, setPlayOffPrediction] = useState(null);

  const results = Array(7);
  const setResults = Array(7);
  [results[0], setResults[0]] = useState("");
  [results[1], setResults[1]] = useState("");
  [results[2], setResults[2]] = useState("");
  [results[3], setResults[3]] = useState("");
  [results[4], setResults[4]] = useState("");
  [results[5], setResults[5]] = useState(""); 
  [results[6], setResults[6]] = useState("");

  const predictions = Array(7);
  const setPredictions = Array(7);
  [predictions[0], setPredictions[0]] = useState("");
  [predictions[1], setPredictions[1]] = useState("");
  [predictions[2], setPredictions[2]] = useState("");
  [predictions[3], setPredictions[3]] = useState("");
  [predictions[4], setPredictions[4]] = useState("");
  [predictions[5], setPredictions[5]] = useState("");
  [predictions[6], setPredictions[6]] = useState("");
  
  console.log(results, predictions);

  const codes = [
    "WC-QF1A",
    "WC-QF1B",
    "WC-QF2A",
    "WC-QF2B",
    "WC-QF3A",
    "WC-QF3B",
    "WC-QF4A",
    "WC-QF4B",
    "WC-SF1A",
    "WC-SF1B",
    "WC-SF2A",
    "WC-SF2B",
    "WC-FA",
    "WC-FB",
    "FA",
    "FB",
    "EC-FA",
    "EC-FB",
    "EC-SF1A",
    "EC-SF1B",
    "EC-SF2A",
    "EC-SF2B",
    "EC-QF1A",
    "EC-QF1B",
    "EC-QF2A",
    "EC-QF2B",
    "EC-QF3A",
    "EC-QF3B",
    "EC-QF4A",
    "EC-QF4B",
  ]

  // contain the teams that are represented in the bracket
  const [teams, setTeams] = useState({
    "WC-QF1A": "Atlanta Hawks",
    "WC-QF1B": "Boston Celtics",
    "WC-QF2A": "Brooklyn Nets",
    "WC-QF2B": "Charlotte Hornets",
    "WC-QF3A": "Chicago Bulls",
    "WC-QF3B": "Cleveland Chandeliers",
    "WC-QF4A": "Dallas Mavericks",
    "WC-QF4B": "Minnesota Timberwolves",
    "EC-QF1A": "Portland Trail Blazers",
    "EC-QF1B": "Detroit Pistons",
    "EC-QF2A": "Toronto Raptors",
    "EC-QF2B": "Washington Wizards",
    "EC-QF3A": "Miami Heat",
    "EC-QF3B": "Milwaukee Bucks",
    "EC-QF4A": "Golden State Warriors",
    "EC-QF4B": "Houston Rockets",
  })  

  const [matchData, setMatchData] = useState({
    "WC-QF1": null,
    "WC-QF2": null,
    "WC-QF3": null,
    "WC-QF4": null, 
    "WC-SF1": null,
    "WC-SF2": null,
    "WC-F": null,
    "F": null,
    "EC-F": null,
    "EC-SF1": null,
    "EC-SF2": null,
    "EC-QF1": null,
    "EC-QF2": null,
    "EC-QF3": null,
    "EC-QF4": null,
  });

  const getOpposingTreeIndex = (treeIndex) => {
    return treeIndex % 2 == 0 ? treeIndex + 1 : treeIndex - 1;
  }

  const toMatchName = (treeIndex) => {
    if (treeIndex === 1) {
      return 'winner';
    }
    // get the upper index for single representative
    const representative = treeIndex % 2 == 0 ? treeIndex : treeIndex - 1;

    const map = {
      1: "CHAMPION",
      2: "F",
      4: "WC-F",
      6: "EC-F",
      8: "WC-SF1",
      10: "WC-SF2",
      12: "EC-SF1",
      14: "EC-SF2",
      16: "WC-QF1",
      18: "WC-QF2",
      20: "WC-QF3",
      22: "WC-QF4",
      24: "EC-QF1",
      26: "EC-QF2",
      28: "EC-QF3",
      30: "EC-QF4",
    }

    return map[representative];
  }

  // Translate 0-30 to a tree index
  // the winner is the tree index 1
  const toTreeIndex = {
    0: 16,
    1: 17,
    2: 18,
    3: 19,
    4: 20,
    5: 21,
    6: 22,
    7: 23,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 4,
    13: 5,
    14: 2,
    15: 3,
    16: 6,
    17: 7,
    18: 12,
    19: 13,
    20: 14,
    21: 15,
    22: 24,
    23: 25,
    24: 26,
    25: 27,
    26: 28,
    27: 29,
    28: 30,
    29: 31,
    30: 1,
  }

  // Reverse toTreeIndex
  const toPostIndex = (function() {
    const reverse = {}
    Object.keys(toTreeIndex).forEach(key => {
      reverse[toTreeIndex[key]] = key;
    })
    return reverse;
  }())

  // fill in the actual slots to be shown 
  const slots = (function(){
    const slots = Array(30).fill(0).map((el, i) => {
      const code = codes[i];
      const matchName = toMatchName(toTreeIndex[i]);
      if (matchName in matchData && matchData[matchName] != null) {
        const teamName = matchData[matchName]['teams'][code.charAt(code.length - 1) == 'A' ? 0 : 1];
        return teamName === '' ? null : teamName;
      }
    })
    return slots;
  }());

  const getPredictionData = (data, index) => {
    fetch('/prediction/playoff/pick/' + authContext.user.username + "/" + data.games[index]).then(res => res.json())
    .then((res) => {
      console.log("GOT PREDICTION RESPONSE " + index, res);
      setPredictions[index](res["pick"]);
    })
    .catch((res) => {
      console.log("error");
    })
  }

  const getResultData = (data, index) => {
    fetch('/prediction/playoff/result/' + data.games[index]).then(res => res.json())
    .then((res) => {
      console.log("GOT MATCH RESPONSE " + index, res);
      setResults[index](res["result"]);
    })
    .catch((res) => {
      console.log("error");
    })
  }

  const onBracketClick = (index) => {
    console.log("click click");
    const matchName = toMatchName(toTreeIndex[index]);
    if (matchName === "winner") return;

    const data = matchData[matchName]

    if (data["teams"][0] === "" && data["teams"][1] === "") {
      return;
    } else {
      console.log("games", data.games);
      
      data.games.forEach((el, i) => getPredictionData(data, i))
      data.games.forEach((el, i) => getResultData(data, i))
      setPlayOffPrediction(data);
    }
  }

  const onPredictionClick = (msg) => {
    console.log(msg);
    if (msg === "close") {
      setPlayOffPrediction(null);
      setPredictions.forEach(el => el(""));
      setResults.forEach(el => el(""));
    }
    
    let updatedValue;
    if (predictions[msg["index"]] === msg['team']) {
      updatedValue = "";
    } else {
      updatedValue = msg['team'];
    }
    const requestBody = {
      method: "put",
      body: JSON.stringify({
        user: authContext.user.username,
        team: updatedValue,
        gameId: msg['gameId'],
      }),
      headers: {'Content-Type' : 'application/json'}
    }
    fetch('/prediction/playoff/add', requestBody).then(res => res.json())
    .then((res) => {
      console.log("GOT RESPONSE", res);
      if (res != null) {
        setPredictions[msg["index"]](updatedValue);
      }
    })
  }

  useEffect(() => {
    const requestBody = {
      method: "post",
      body: JSON.stringify({
        user: authContext.user.username,
      }),
      headers: {'Content-Type' : 'application/json'}
    }

    fetch('/prediction/playoff/bracket/' + year, requestBody).then(res => res.json())
    .then((res) => {
      console.log("GOT RESPONSE", res);

      // transform the data to a different form...
      const newMatchData = {};

      console.log(res["westernConference"])
      // newMatchData["WC-QF1"] = res["westernConference"]["quarterfinals"][0];

      Object.keys(res["westernConference"]["quarterfinals"]).forEach((key) => {
        newMatchData["WC-QF" + (parseInt(key) + 1)] = res["westernConference"]["quarterfinals"][key];
      })

      Object.keys(res["westernConference"]["semifinals"]).forEach((key) => {
        newMatchData["WC-SF" + (parseInt(key) + 1)] = res["westernConference"]["semifinals"][key];
      })

      newMatchData["WC-F"] = res["westernConference"]["confinals"][0];

      Object.keys(res["easternConference"]["quarterfinals"]).forEach((key) => {
        newMatchData["EC-QF" + (parseInt(key) + 1)] = res["easternConference"]["quarterfinals"][key];
      })

      Object.keys(res["easternConference"]["semifinals"]).forEach((key) => {
        newMatchData["EC-SF" + (parseInt(key) + 1)] = res["easternConference"]["semifinals"][key];
      })

      newMatchData["EC-F"] = res["easternConference"]["confinals"][0];
      
      newMatchData["F"] = res["finals"];

      setMatchData(newMatchData); 
    })
  }, [])

  console.log("match data", matchData);

  return <BracketView slots={slots} onBracketClick={onBracketClick} onPredictionClick={onPredictionClick} counter={counter} predictions={predictions} results={results} playOffPrediction={playOffPrediction}/>
}

