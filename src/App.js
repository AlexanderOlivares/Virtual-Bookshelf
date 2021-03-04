import "./App.css";
import { useState } from "react";
import { auth, google } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Navbar";
import Profile from "./Profile";
import LandingPage from "./LandingPage";
import Signup from "./Signup";

function App() {
  const [user, setUser] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <Navbar user={user} />
      </div>
      <LandingPage />
      <Signup
        user={user}
        setUser={setUser}
        setIsLoggedIn={setIsLoggedIn}
        isLoggedIn={isLoggedIn}
      />
    </Router>
  );
}

export default App;
