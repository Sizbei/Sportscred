import React from 'react';
import './Homepage.css';
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route} from "react-router-dom";

import Navbar from "./components/Navbar"
import Example from "./components/Example"
import TheZone from "./components/TheZone";
import Trivia from "./components/Trivia";
import Analysis from "./components/Analysis";
import PicksAndPredictions from "./components/PicksAndPredictions";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <div className="container">
      <Navbar />
      <br/>
      <Route path="/" exact component={Example} />
      <Route path="/TheZone" exact component={TheZone} />
      <Route path="/Trivia" component={Trivia} />
      <Route path="/Analysis" component={Analysis} />
      <Route path="/PicksAndPredictions" component={PicksAndPredictions} />
      <Route path="/Profile" component={Profile} />
      </div>
    </Router>
  );
}

export default App;
