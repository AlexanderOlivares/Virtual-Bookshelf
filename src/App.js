import "./App.css";
import { useState } from "react";
import { auth, google } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Navbar";
import Profile from "./Profile";
import LandingPage from "./LandingPage";
import Signup from "./Signup";
import List from "./List";
import Search from "./Search";
import SignIn from "./SignIn";

function App() {
  const [user, setUser] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(null);

  auth.onAuthStateChanged(user => {
    if (user) {
      setIsLoggedIn(true);
      console.log(user.uid + "is signed in");
    } else {
      setIsLoggedIn(null);
      console.log("auth successful sign out");
    }
  });

  return (
    <Router>
      <div className="App">
        <Navbar
          user={user}
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
                user={user}
                setUser={setUser}
                setIsLoggedIn={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
              />
            </Route>
            <Route exact path="/signup">
              <Signup
                user={user}
                setUser={setUser}
                setIsLoggedIn={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
              />
            </Route>
            <Route exact path="/profile">
              <Profile user={user} isLoggedIn={isLoggedIn} />
            </Route>
            <Route exact path="/list">
              <List />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
