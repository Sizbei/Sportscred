import React, {useEffect, useContext, useState} from 'react';
import Header from './Header';
import axios from 'axios';
import InGameTrivia from './InGameTrivia';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import TriviaSidebar from './TriviaSidebar';
import Queue from './Queue';

/* State.
  state = {
    mode: nav | singlePlayer | online | practice
    username: {user:, enemy:}
    ppurl: {user:, enemy:}
    stop: nostop | single-transition-immediate | transition-showSolution | toNav  // a state
    showPostScreen: bool
    lists = [{questionNumber:, question:, enemyCorrect:, userCorrect:}];
    score = {user:, enemy: };
    acsChange = {user:, enemy:}
    instance: // a matchId
    initialACS {user:, enemy:}
  }
*/

export default function Trivia(props) {

  const testLog = () => {
    console.log("TEST TEST TESTES");
  }
  
  const authContext = useContext(AuthContext);
  const [initialState, setInitialState] = useState({  // still gets modified by one useEffect() to get urls
    mode:"nav", 
    username:{user: authContext.user.username, enemy: ""},
    ppurl: {user: "", enemy: ""},
    stop: "nostop",
    showPostScreen: false,
    list: [],
    score: {},
    acsChange: {},
    instance: null,
    queueActive: false,
  });

  const [state, setState] = useState(JSON.parse(JSON.stringify(initialState)));
  const [select, setSelect] = useState(null);
  const transitionSpeed = 2000;

  const handleModeSelect = req => {
    console.log("select state", select);

    let mode = req;
    if (req === "playAgain") {
      mode = state.mode;
    }
    console.log("mode select", req, mode);

    /*-----handle navigation--------*/
    if (mode === "nav") {
      const newState = deepcopy(JSON.parse(JSON.stringify(initialState)));
      newState.stop = "toNav";
      setState(newState);
    } else if (mode === "singlePlayer") {
      const newState = deepcopy(JSON.parse(JSON.stringify(initialState)));
      newState.mode = mode;
      newState.lists = [];
      newState.score = {"user": 0};
      newState.acsChange = {}
      newState.gameOver = false;

      axios.post('/trivia/solo/create', { username: authContext.user.username }).then(data => {
        console.log("START GOT", data.data);
  
        const next = {
          instance: data.data.instance,
          question: "",
          answer: ""
        }
  
        newState.instance = data.data.instance;
        newState.initialACS = {"user": data.data.acs};
        
        axios.put("/trivia/solo/next", next).then (nextData => {
          console.log("got next data", nextData.data);
          Object.keys(nextData.data).forEach((name, val) => { // copy over
            newState[name] = nextData.data[name];
          })
          newState.list = [{
            questionNumber: 1,
            question: nextData.data.currentQuestion,
          }];
          
          console.log("NEXT INITIAL", newState);
          newState.score = {user: 0};
          setState(newState);
        }).catch(e => {
          console.log("some error", e);
        })
      })
    } else if (mode === "online") {
      // enter queue 
      const newState = {...state};
      newState.queueActive = true;
      newState.lastStop = state.stop;
      newState.stop = "queue";
      console.log("Set new state for online", newState);
      setState(newState);
    } else if (mode === "practice") {
      // TODO
    }
  }

  const handleCloseQueue = () => {
    if (state.stop != "queue") { // do not overwrite state
      return;
    }

    const newState = {...state};
    newState.queueActive = false;
    newState.stop = state.lastStop;
    setState(newState);
  }

  const initOnline = (enemy) => {
    const newState = JSON.parse(JSON.stringify(initialState));
    newState.mode = "online";
    newState.list = [];
    newState.username["enemy"] = enemy;
    newState.score = {"user": 0, "enemy": 0};
    newState.acsChange = {}
    newState.gameOver = false;

    const fetchInit = {
      method: "post",
      body: JSON.stringify({
        user: authContext.user.username,
        enemy: enemy,
      }),
      headers: {'Content-Type' : 'application/json'}
    }
    console.log("Request online init", fetchInit);
    fetch('/trivia/head-to-head/init', fetchInit).then(res => res.json())
    .then((initData) => {
      console.log("got init", initData);
      newState.instance = initData._id
      newState.stop = "getenemyimage";
      setState(newState);
    })
  }

  const handleMatchId = (matchId) => {
    console.log("Got matchId", matchId);
    const newState = JSON.parse(JSON.stringify(initialState));
    newState.mode = "online";
    newState.list = [];
    // newState.username["enemy"] = enemy;
    newState.score = {"user": 0, "enemy": 0};
    newState.acsChange = {}
    newState.gameOver = false;

    newState.instance = matchId;
    
    const fetchUpdate = {
      method: "put",
      body: JSON.stringify({
        _id: matchId,
        user: authContext.user.username
      }),
      headers: {'Content-Type' : 'application/json'}
    }
    
    // console.log("Fetching state...", fetchUpdate);
    fetch('/trivia/head-to-head/update', fetchUpdate).then(res => res.json())
    .then((updateData) => {
      console.log(updateData);
      newState.initialACS = {
        user: updateData.gameInstance.users.user.initAcs,
        enemy: updateData.gameInstance.users.enemy.initAcs,
      }
      newState.score = {
        user: updateData.gameInstance.users.user.point,
        enemy: updateData.gameInstance.users.enemy.point
      }
      newState.username["enemy"] = updateData.gameInstance.users.enemy.username;
      console.log("BEFORE UPDATE", newState);
      newState.stop = "getenemyimage";
      setState(newState);
    })
    .catch(() => {
      repeat();
    })
  }

  const handleOptionSelect = option => {
    console.log(option);

    if (state.mode === "singlePlayer" && !state.gameOver && state.stop === "nostop") {
      const newState = {...state};
      newState.stop = "single-transition-immediate"
      newState.chosenOption = option;
      newState.chosenOptions = {user: state.options[option], enemy: ""};
      setState(newState);
    } else if (state.mode === "online" && !state.gameOver) {
      try {
        setSelect(option == null ? "" : state.options[option]);
      } catch (e) {
        console.log("error in option select");
        return;
      }
    }
  }

  // process an online option select
  const processOptionSelect = () => {
    if (state.mode !== "online") {
      console.log("ERROR mode can only be online");
      return;
    }

    if (select == null) {
      console.log("ERROR option is not new.");
      return;
    }

    const fetchSubmit = {
      method: "post",
      body: JSON.stringify({
        _id: state.instance,
        username: authContext.user.username,
        answer: select,
      }),
      headers: {'Content-Type' : 'application/json'}
    }

    console.log("Process option...");
    
    fetch('/trivia/head-to-head/submit', fetchSubmit).then(res => res.json())
    .then((updateSubmit) => {
      console.log("got submit data", updateSubmit);
      const newState = {...state}
      newState.chosenOption = select;
      newState.chosenOptions = {user: select, enemy: null}
      newState.stop = "fetch";
      setSelect(null);
      setState(newState);
    })
    .catch(() => {
      repeat();
    })
  }

  const repeat = () => {
    const newState = {...state};
    newState.stop = "repeat";
    setState(newState);
  }

  // Transition to the next question for online play
  const transitionNext = (data) => {
    const currentQuestion = data.questions[data.curQuestionIndex];
    const newState = {...state}

    newState.gameOver = data.status != "open"; 

    if (newState.gameOver) {
      newState.stop = "online-done";
      setState(newState);
      return;
    }

    // Remove previous transition data
    delete newState.nextData;
    delete newState.previousAnswer;

    // update score
    newState.score = {user: data.users.user.point, enemy: data.users.enemy.point};
    newState.acsChange = {user: data.users.user.acsChange, enemy: data.users.enemy.acsChange};
    
    // update displayed questions and answers
    
    newState.currentQuestion = currentQuestion.triviaQuestion.question;
    newState.options = currentQuestion.triviaQuestion.options;
    newState.questionCount = data.curQuestionIndex + 1;

    const list = [] // construct list
    let questionNumber = 0;
    data.questions.forEach(e => {
      const question = e.triviaQuestion.question;
      questionNumber++;
      
      const entry = {
        questionNumber: questionNumber,
        question: question,
      }

      if (questionNumber - 1 < data.curQuestionIndex || (data.status == "close" && questionNumber <= 11)) { // answers present!
        const userCorrect = "accuracy" in e.responses.user ? e.responses.user.accuracy : false;
        const enemyCorrect = (e.responses.enemy != null && "accuracy" in e.responses.enemy) 
          ? e.responses.enemy.accuracy : false;
        entry.userCorrect = userCorrect;
        entry.enemyCorrect = enemyCorrect;

        if (e.responses.user.responseTime > e.responses.enemy.responseTime) {
          entry.userCorrect = false;
        } else {
          entry.enemyCorrect = false;
        }
      }
      list.push(entry);
    })

    newState.list = list;
    newState.stop = "repeat";
    // console.log("new state", newState);
    setState(newState);
  }
  
  /*------------State Transitions----------------*/
  // A transition from state-immediate to fetching for next data
  useEffect(() => { 
    if (!("stop" in state) || state.stop !== "single-transition-immediate") {
      return;
    }

    console.log("TRANSITION 1");

    const next = {
      instance: state.instance,
      question: state.currentQuestion,
      answer: state.options[state.chosenOption],
    }

    axios.put("/trivia/solo/next", next).then (nextData => {
      console.log("TRIVIA NEXT", nextData.data);

      const newState = {...state};
      newState.score = {"user": nextData.data.score}; // needs to overwrite the copy
      newState.list[newState.list.length - 1].userCorrect = nextData.data.previous === "correct";
      newState.previousAnswer = nextData.data.previousAnswer;

      if ("questionCount" in nextData.data) { // Game goes on
        newState.nextData = nextData; // Store nextData for next transition
      } else {
        newState.finalACS = {user: nextData.data.acs};
        newState.acsChange = {user: nextData.data.points};
        newState.nextData = {data: {}}; // no next data
      }
      
      newState.gameOver = nextData.data.gameOver;
      newState.stop = "transition-showsolution"
      setState(newState);
    }).catch(e => {
      console.log("some error", e);
    })
  }, [state.stop])

  // A transition from transition-showsolution to displaying the next question
  useEffect(() => { 
    if (!("stop" in state) || state.stop !== "transition-showsolution") {
      return;
    }

    console.log("TRANSITION 2");

    const showNextQuestion = () => {
      const newState = {...state};
      const nextData = state.nextData;

      

      if ("questionCount" in nextData.data) { // Game goes on
        Object.keys(nextData.data).forEach((name, val) => { // copy over from nextData.data
          if (name === "score") {
            return;
          }
          newState[name] = nextData.data[name];
        }) 
        newState.list.push({
          questionNumber: nextData.data.questionCount,
          question: nextData.data.currentQuestion,
        })
        newState.startTime = Date.parse(nextData.data.time);
        newState.stop = "nostop";
      } else {
        newState.stop = "single-done"; 
      }

      // Remove transition state
      delete newState.previousAnswer;
      newState.chosenOptions = {user: "", enemy: ""};

      setState(deepcopy(newState));      
    }

    setTimeout(showNextQuestion, transitionSpeed);
  }, [state.stop])

  // Transition from anywhere to nav screen
  useEffect(() => {
    if (!("stop" in state) || state.stop !== "toNav") {
      return;
    }
    
    setState(JSON.parse(JSON.stringify(initialState)));
  }, [state.stop])

  // an infinite loop for online play
  useEffect(() => {
    if (!("stop" in state) || state.stop !== "repeat") {
      return;
    }
    
    // clearTimeout(state.timeOut); // clear any previous fetch timer

    // Check if there is a selected, unprocessed answer
    if (select != null) {
      processOptionSelect();
    } else {
      // Otherwise go fetch again
      const newState = {...state};
      newState.stop = "fetch";
      setState(newState);
    }
  }, [state.stop])

  // clear some state, transition to online-getnext2
  useEffect(() => {
    if (!("stop" in state) || state.stop !== "online-getnext") {
      return;
    }

    const wait = state.status == "close" ? transitionSpeed : Math.max(0, transitionSpeed - (new Date() - state.startTime));
    
    setTimeout(() => {
      const newState = {...state};
      delete newState.previousAnswer;
      newState.chosenOptions = {user: "", enemy: ""};
      newState.stop = "online-getnext2";
      setState(newState);
    }, wait);
  }, [state.stop])

  // goto the next question for online play
  useEffect(() => {
    if (!("stop" in state) || state.stop !== "online-getnext2") {
      return;
    }
    
    transitionNext(state.nextData);
  }, [state.stop])

  // For multiplayer, fetch the state, transition to "repeat"
  useEffect(() => {
    if (!("stop" in state) || state.stop !== "fetch") {
      return;
    }

    const showSolution = (data) => {
      try {
        console.log("Showing solution for ", transitionSpeed);
        const newState = {...state}
        
        // const currentQuestion = data.questions[data.curQuestionIndex];
        let lastQuestion = data.questions[data.curQuestionIndex - 1];
        if (data.status == "close") {
          lastQuestion = data.questions[data.questions.length - 1];
        }
        newState.startTime = Date.parse(data.questions[data.curQuestionIndex].startTime);
        
        // update score
        newState.score = {user: data.users.user.point, enemy: data.users.enemy.point};
        newState.acsChange = {user: data.users.user.acsChange, enemy: data.users.enemy.acsChange};
  
        console.log("GOT DATA", data);
  
        // mark enemy's option
        console.log("Enemy response", lastQuestion.responses.enemy.answer, lastQuestion.triviaQuestion.answer);
        newState.chosenOptions["enemy"] = "answer" in lastQuestion.responses.enemy ? lastQuestion.responses.enemy.answer : "";
        console.log("new chosenoptions", newState.chosenOptions);
  
        const list = [] // construct list
        let questionNumber = 0;
        data.questions.forEach(e => {
          const question = e.triviaQuestion.question;
          questionNumber++;
          
          const entry = {
            questionNumber: questionNumber,
            question: question,
          }
  
          if (questionNumber - 1 < data.curQuestionIndex || (data.status == "close" && questionNumber <= 11)) { // answers present!
            const userCorrect = "accuracy" in e.responses.user ? e.responses.user.accuracy : false;
            const enemyCorrect = (e.responses.enemy != null && "accuracy" in e.responses.enemy) 
              ? e.responses.enemy.accuracy : false;
            entry.userCorrect = userCorrect;
            entry.enemyCorrect = enemyCorrect;
            list.push(entry);
          }
        })
  
        newState.list = list;
  
        newState.previousAnswer = lastQuestion.triviaQuestion.answer;
        newState.status = data.status;
        newState.stop = "online-getnext";
        newState.nextData = data;
        setState(newState)
      } catch (e) {
        console.log("error", state);
        const newState = {...state}
        newState.stop = "repeat";
        setState(newState);
        return;
      } 
    }

    const fetchUpdate = {
      method: "put",
      body: JSON.stringify({
        _id: state.instance,
        user: authContext.user.username
      }),
      headers: {'Content-Type' : 'application/json'}
    }

    
    fetch('/trivia/head-to-head/update', fetchUpdate).then(res => res.json())
    .then((updateData) => {
      try {
        console.log("got...", updateData);
        const data = updateData.gameInstance;
        const currentQuestion = data.questions[data.curQuestionIndex];
  
        // is it the first question? Wait.
        if (data.curQuestionIndex == 0) {
          setTimeout(() => {
            transitionNext(data);
          }, Math.max(0, 1000 - (new Date() - Date.parse(currentQuestion.startTime))))
          return;
        }

        // is it a new question? play the transition. 
        if ("currentQuestion" in state && state.currentQuestion != currentQuestion.triviaQuestion.question || data.status == "close") {
          console.log("--------------NEW QUESTION IS HERE-------------")
          showSolution(data);
          // setTimeout(() => transitionNext(data), transitionSpeed); // display next question after some time
        } else {
          transitionNext(data);
        }
      } catch (e) {
        // TODO possible bug if the game is just over, infinite loop for data and never goes to post nav screen
        console.log("error in update");
        repeat();
        return;
      }
    })
    .catch(() => {
      repeat();
    })
  }, [state.stop])

  // Fetch this user's image
  useEffect(() => {
    fetch("/profile/" + authContext.user.username).then(res => res.json())
      .then(data => {
        const newState = deepcopy(state);
        if ("ppurl" in newState) {
          newState.ppurl.user = data.image;
        } else {
          newState.ppurl = {
            user: data.image
          }
        }
        setInitialState(JSON.parse(JSON.stringify(newState)));
        setState(newState);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [])

  // Fetch the enemy's image
  useEffect(() => {
    if (!("stop" in state) || state.stop !== "getenemyimage") {
      return;
    }

    if (!("username" in state) || !("enemy" in state.username) || state.username.enemy == "") {
      return;
    }

    fetch("/profile/" + state.username.enemy).then(res => res.json())
      .then(data => {
        const newState = deepcopy(state);
        if ("ppurl" in newState) {
          newState.ppurl.enemy= data.image;
        } else {
          newState.ppurl = {
            enemy: data.images
          }
        }
        console.log("Fetched enemy url");
        newState.stop = "fetch"; // goto fetch
        setState(newState);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [state.stop])

  const [triviaPage, setTriviaPage] = useState(null);

  // Render on change of state
  useEffect(() => {
    let nextTriviaPage = <InGameTrivia {...state} handleModeSelect={handleModeSelect} select={select} handleOptionSelect={handleOptionSelect}/>;
    setTriviaPage(nextTriviaPage);
  }, [state]);

  return(
    <div>
      {triviaPage}
      {state.queueActive ? <Queue handleCloseQueue={handleCloseQueue} handleMatchId={handleMatchId} {...state} /> : null}
    </div>
  );
}

function deepcopy(o) {
  // return JSON.parse(JSON.stringify(o))
  return {...o}
}