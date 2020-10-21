import React from 'react';
import './styling/Homepage.css';
import { BrowserRouter as Router, Route} from "react-router-dom";

import Login from "./components/Login";
import TheZone from "./components/TheZone";
import Trivia from "./components/Trivia";
import Analysis from "./components/Analysis";
import PicksAndPredictions from "./components/PicksAndPredictions";
import Profile from "./components/Profile";
import Registration from "./components/Registration"
import Settings from "./components/Settings"

function App() {
  return (
    <Router>
      <div className="container">
      <Route path="/" exact component={Login} />
      <Route path="/TheZone" exact component={TheZone} />
      <Route path="/Trivia" component={Trivia} />
      <Route path="/Analysis" component={Analysis} />
      <Route path="/PicksAndPredictions" component={PicksAndPredictions} />
      <Route path="/Profile" component={Profile} />
      <Route path="/Registration" component={Registration} />
      <Route path="/Settings" component={Settings} />
      </div>
    </Router>
  );
}

export default App;
