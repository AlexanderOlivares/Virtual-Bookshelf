import "./App.css";
import { useState } from "react";
import { auth, google } from "./firebase";
import { db } from "./firebase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import Navbar from "./Navbar";
import Profile from "./Profile";
import Home from "./Home";
import Signup from "./Signup";
import Shelf from "./Shelf";
import Search from "./Search";
import SignIn from "./SignIn";
import { GlobalStyle } from "./GlobalStyle";
import { lightTheme, darkTheme } from "./Theme";

function App() {
  const [theme, setTheme] = useState(lightTheme);

  const [username, setUsername] = useState("");

  const [user_UID, setUser_UID] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const [userEmail, setUserEmail] = useState(null);

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
            setUserEmail(googleAuthUser.email);
            // console.log(data);
            // console.log(googleAuthUser);
            console.log(googleAuthUser.uid + "is signed in");
          } else {
            // doc.data() will be undefined in this case
            alert("Error logging in. Please try again");
            console.log(doc.data() + "No such document!");
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

  console.log(isLoggedIn);

  return (
    <>
      <GlobalStyle theme={theme} />
      <ThemeProvider theme={theme}>
        <Router>
          <div className="App">
            <Navbar
              theme={theme}
              setTheme={setTheme}
              username={username}
              setUsername={setUsername}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setUserEmail={setUserEmail}
            />
            <div className="content">
              <Switch>
                <Route exact path="/">
                  <Home
                    theme={theme}
                    username={username}
                    user_UID={user_UID}
                    isLoggedIn={isLoggedIn}
                  />
                </Route>
                <Route exact path="/search">
                  <Search
                    theme={theme}
                    user_UID={user_UID}
                    isLoggedIn={isLoggedIn}
                    username={username}
                  />
                </Route>
                <Route exact path="/signin">
                  <SignIn
                    theme={theme}
                    username={username}
                    setUsername={setUsername}
                    setIsLoggedIn={setIsLoggedIn}
                    isLoggedIn={isLoggedIn}
                  />
                </Route>
                <Route exact path="/signup">
                  <Signup
                    theme={theme}
                    userEmail={userEmail}
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
                    theme={theme}
                    username={username}
                    user_UID={user_UID}
                    isLoggedIn={isLoggedIn}
                  />
                </Route>
              </Switch>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
