import React, {useContext} from 'react';
import './styling/Homepage.css';
import { BrowserRouter as Router, Route} from "react-router-dom";
import {AuthContext} from './Context/AuthContext';
import PrivateRoute from './hocs/PrivateRoute';
import PublicRoute from './hocs/PublicRoute';
import AdminRoute from './hocs/AdminRoute'

import Login from "./components/Login";
import TheZone from "./components/TheZone";
import Trivia from "./components/Trivia";
import Analysis from "./components/Analysis";
import PicksAndPredictions from "./components/PicksAndPredictions";
import Profile from "./components/Profile";
import Post from "./components/PostView"
import Settings from "./components/Settings"
import Header from "./components/Header"
import Citations from "./components/Citations"
import Queue from "./components/Queue"
import AnalysisPost from "./components/AnalysisPostView"
import ReportPost from "./components/ReportPosts"
import ReportComment from "./components/ReportComments"
import Bracket from "./components/Bracket"
import Leaderboard from "./components/Leaderboard"
import IndvPrediction from "./components/IndvPrediction";
import PickHistory from "./components/PickHistory";

function App() {
  //example of using authContext in function
  const authContext = useContext(AuthContext);
  console.log(authContext.user);
  console.log(authContext.isAuthenticated);

  return (
    <Router>
      <div className="container">
      <Header />
      <PublicRoute path="/" exact component={Login} />
      <PrivateRoute path="/TheZone" exact component={TheZone} />
      <PrivateRoute path="/TheZone/display" component={Post} />
      <AdminRoute path= "/Reports/post" component={ReportPost}/>
      <AdminRoute path= "/Reports/comment" component={ReportComment}/>
      <PrivateRoute path="/Trivia" component={Trivia} />
      <PrivateRoute exact path="/Analysis" component={Analysis} />
      <PrivateRoute path="/ip" component={IndvPrediction} /> 
      <PrivateRoute path="/ph" component={PickHistory}/>
      <PrivateRoute path="/analysis/post/:id" component={AnalysisPost} />
      <PrivateRoute path="/Predictions" component={PicksAndPredictions} />
      <PrivateRoute path="/Profile" component={Profile} />
      <PrivateRoute path="/Settings" component={Settings} />
      <PrivateRoute path="/Citations" component={Citations} />
      <PrivateRoute path="/Queue" component={Queue} />
      <PrivateRoute path="/Bracket" component={Bracket} />
      <PrivateRoute path="/prediction/leaderboard" component={Leaderboard} />
      </div>
    </Router>
  );
}

export default App;
