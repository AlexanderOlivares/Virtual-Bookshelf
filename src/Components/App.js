import { useState } from "react";
import { auth } from "./firebase";
import { db } from "./firebase";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Navbar from "./Navbar";
import Home from "./Home";
import Signup from "./Signup";
import Shelf from "./Shelf";
import Search from "./Search";
import SignIn from "./SignIn";
import { GlobalStyle } from "./GlobalStyle";
import { lightTheme } from "./Theme";
import ViewShelf from "./ViewShelf";

function App() {
  const [theme, setTheme] = useState(lightTheme);

  const [username, setUsername] = useState("");

  const [user_UID, setUser_UID] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const [userEmail, setUserEmail] = useState(null);

  // checks for sign-ins/outs
  auth.onAuthStateChanged(googleAuthUser => {
    if (googleAuthUser) {
      const docRef = db.collection("users").doc(`${googleAuthUser.uid}`);

      docRef
        .get()
        .then(doc => {
          let data = doc.data();
          setUsername(googleAuthUser.displayName || data.username);
          setUser_UID(googleAuthUser.uid);
          setIsLoggedIn(true);
          setUserEmail(googleAuthUser.email);
        })
        .catch(error => {
          alert(`${error}. Could not sign in. Please try again.`);
          console.warn("Error getting document:", error);
        });
    } else {
      // successful sign out
      setIsLoggedIn(null);
    }
  });

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
                    user_UID={user_UID}
                  />
                </Route>
                <Route exact path="/shelf/">
                  <Shelf
                    theme={theme}
                    username={username}
                    user_UID={user_UID}
                    isLoggedIn={isLoggedIn}
                  />
                </Route>
                <Route exact path="/ViewShelf/:uid">
                  <ViewShelf
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
