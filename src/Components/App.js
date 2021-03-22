import "./App.css";
import { useState } from "react";
import { auth, google } from "./firebase";
import { db } from "./firebase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Navbar";
import Profile from "./Profile";
import Home from "./Home";
import Signup from "./Signup";
import Shelf from "./Shelf";
import Search from "./Search";
import SignIn from "./SignIn";

function App() {
  const [username, setUsername] = useState("");

  const [user_UID, setUser_UID] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(null);

  auth.onAuthStateChanged(googleAuthUser => {
    if (googleAuthUser) {
      const docRef = db.collection("users").doc(`${googleAuthUser.uid}`);

      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            let data = doc.data();
            setUsername(googleAuthUser.displayName || data.username);
            setUser_UID(googleAuthUser.uid);
            setIsLoggedIn(true);
            console.log(googleAuthUser.uid + "is signed in");
          } else {
            // doc.data() will be undefined in this case
            console.log(doc.data + "No such document!");
          }
        })
        .catch(error => {
          alert(`Could not sign in ${error}`);
          console.log("Error getting document:", error);
        });
    } else {
      setIsLoggedIn(null);
      console.log("successful sign out");
    }
  });

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
              <Home
                username={username}
                user_UID={user_UID}
                isLoggedIn={isLoggedIn}
              />
            </Route>
            <Route exact path="/search">
              <Search user_UID={user_UID} />
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
            <Route exact path="/shelf">
              <Shelf
                username={username}
                user_UID={user_UID}
                isLoggedIn={isLoggedIn}
              />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
