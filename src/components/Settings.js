import React from 'react';
import '../styling/Homepage.css';
import { BrowserRouter as Router, Route} from "react-router-dom";

import Profile from "./EditProfile";

function App() {
  return (
    <Route path="/Settings/Profile" component={Profile} />
  );
}

export default App;
