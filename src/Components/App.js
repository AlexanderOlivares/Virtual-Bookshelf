import "./App.css";
import { useState } from "react";
import { auth, google } from "./firebase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Navbar";
import Profile from "./Profile";
import LandingPage from "./LandingPage";
import Signup from "./Signup";
import List from "./List";
import Search from "./Search";
import SignIn from "./SignIn";

function App() {
  const [username, setUsername] = useState("");

  const [user_UID, setUser_UID] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(null);

  auth.onAuthStateChanged(googleAuthUser => {
    if (googleAuthUser) {
      setUsername(googleAuthUser.displayName || googleAuthUser.email);
      setUser_UID(googleAuthUser.uid);
      setIsLoggedIn(true);
      console.log(googleAuthUser.uid + "is signed in");
    } else {
      setIsLoggedIn(null);
      console.log("auth successful sign out");
    }
  });

  console.log(username);

  return (
    <Router>
      <div className="App">
        <Navbar
          username={username}
          setUsername={setUsername}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <LandingPage />
            </Route>
            <Route exact path="/search">
              <Search />
            </Route>
            <Route exact path="/signin">
              <SignIn
                username={username}
                setUsername={setUsername}
                setIsLoggedIn={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
              />
            </Route>
            <Route exact path="/signup">
              <Signup
                username={username}
                setUsername={setUsername}
                setIsLoggedIn={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
              />
            </Route>
            <Route exact path="/profile">
              <Profile username={username} isLoggedIn={isLoggedIn} />
            </Route>
            <Route exact path="/list">
              <List username={username} isLoggedIn={isLoggedIn} />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
