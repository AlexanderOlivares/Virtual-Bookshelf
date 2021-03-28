import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { auth, google } from "./firebase";
import Home from "./Home";
import { FaBookReader } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  StyledGoogleButton,
  StyledButton,
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

  function handleClick() {
    auth
      .signInWithPopup(google)
      .then(result => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in username info.
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
          <h1>Sign in</h1>
          {/* { this is for signin just reusing signup styled coponent} */}
          <div>
            <FaBookReader size={100} style={{ margin: 30 }}></FaBookReader>
          </div>
          <StyledSignup key={formKey} onSubmit={handleSubmit}>
            <StyledInput
              required
              name="email"
              placeholder="email"
              onChange={handleChange}
            ></StyledInput>
            <br></br>
            <StyledInput
              required
              placeholder="password"
              name="password"
              type="password"
              onChange={handleChange}
            ></StyledInput>
            <br></br>
            <StyledButton>sign in</StyledButton>
            <StyledP>or</StyledP>
          </StyledSignup>
          <StyledGoogleButton name="googleSignIn" onClick={handleClick}>
            {<FcGoogle />} Sign up with Google
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
