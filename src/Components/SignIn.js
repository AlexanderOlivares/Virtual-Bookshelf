import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { auth, google } from "./firebase";
import Home from "./Home";
import {
  StyledGoogleButton,
  StyledInput,
  StyledSignup,
  StyledP,
} from "./Signup";

function SignIn({ isLoggedIn, setIsLoggedIn, username, setUsername }) {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [formKey, setFormKey] = useState(uuidv4());

  function handleChange(e) {
    const { name, value } = e.target;
    setInput(prev => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const email = input.email;
    const password = input.password;

    setInput({
      email: "",
      password: "",
    });

    setFormKey(uuidv4());

    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        let username = userCredential.username;
        setUsername(email);
        setIsLoggedIn(true);
        console.log(username);
      })
      .catch(error => {
        alert(`could not sign in ${error.code}`);
        console.log(error.code);
        console.log(error.message);
      });
  }

  function handleClick(e) {
    auth
      .signInWithPopup(google)
      .then(result => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in username info.
        var googleUser = result.username;
        setIsLoggedIn(true);
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        setIsLoggedIn(null);
        alert(`${errorCode}${errorMessage}`);
        console.log([errorCode, errorMessage, credential, email]);
      });
  }

  return (
    <div>
      {!isLoggedIn ? (
        <div>
          {/* { this is for signin just reusing signup styled coponent} */}
          <StyledSignup key={formKey} onSubmit={handleSubmit}>
            <p>Sign in</p>
            <input
              name="email"
              placeholder="email"
              onChange={handleChange}
            ></input>
            <br></br>
            <input
              placeholder="password"
              name="password"
              type="password"
              onChange={handleChange}
            ></input>
            <br></br>
            <button>sign in</button>
          </StyledSignup>
          <p>or</p>
          <StyledGoogleButton name="googleSignIn" onClick={handleClick}>
            Sign in with google
          </StyledGoogleButton>
        </div>
      ) : (
        <>
          <Home isLoggedIn={isLoggedIn} username={username} />
        </>
      )}
    </div>
  );
}

export default SignIn;
