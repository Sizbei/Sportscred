import React from 'react';
import '../styling/Homepage.css';
import { BrowserRouter as Router, Route} from "react-router-dom";

import Profile from "./EditProfile";
import Account from "./EditAccount";

function App() {
  return (
    <div className="container">
      <Route path="/Settings/Profile" component={Profile} />
      <Route path="/Settings/Account" component={Account} />
    </div>
  );
}

export default App;
