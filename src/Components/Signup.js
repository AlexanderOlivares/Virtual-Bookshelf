import React from "react";
import { useState } from "react";
import { auth, google } from "./firebase";
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import Profile from "./Profile";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Search from "./Search";

export const StyledSignup = styled.form`
  background-color: dodgerblue;
  margin: 0 auto;
  width: 75%;
  display: block;
  padding: 10px;
  border-radius: 5px;
`;

export const StyledInput = styled.input`
  width: 70%;
  border-radius: 5px;
  font-size: 12px;
`;

export const StyledP = styled.p`
  font-size: 8px;
`;

export const StyledGoogleButton = styled.button`
  height: 2em;
  border-radius: 5px;
  background-color: red;
`;

function Signup({ username, isLoggedIn }) {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    const username = input.username;
    const email = input.email;
    const password = input.password;
    const confirmPassword = input.confirmPassword;

    let reg = /^.{6,}$/g;

    if (!reg.test(password)) {
      alert("password must be at least 6 characters long");
    }

    if (password !== confirmPassword) {
      alert("passwords do not match");
    }

    setInput({
      username: "",
      email: "",
      password: "",
    });

    setFormKey(uuidv4());

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        return db.collection("users").doc(userCredential.user.uid).set({
          username: username,
          email: email,
          uid: userCredential.user.uid,
        });
      })
      .catch(error => {
        alert(`could not log in ${error.code}`);
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
        var userCredential = result.user;
        return db.collection("users").doc(result.user.uid).set({
          username: result.user.displayName,
          email: result.user.email,
          uid: result.user.uid,
        });
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        alert(`could not signup: ${errorCode}${errorMessage}`);
        console.log([errorCode, errorMessage, credential, email]);
      });
  }

  return (
    <div>
      {isLoggedIn ? (
        <>
          <Search username={username} />
        </>
      ) : (
        <>
          <StyledSignup key={formKey} onSubmit={handleSubmit}>
            <StyledInput
              name="username"
              placeholder="pick a username"
              onChange={handleChange}
            ></StyledInput>
            <br></br>
            <StyledInput
              name="email"
              placeholder="your email"
              onChange={handleChange}
            ></StyledInput>
            <br></br>
            <StyledP>Password must be at least 6 characters long</StyledP>
            <StyledInput
              placeholder="create a password"
              name="password"
              type="password"
              onChange={handleChange}
            ></StyledInput>
            <StyledInput
              placeholder="confirm your password"
              name="confirmPassword"
              type="password"
              onChange={handleChange}
            ></StyledInput>
            <br></br>
            <button>create my account</button>
            <br></br>
            <StyledP>Already have an account?</StyledP>
            <StyledP>
              <Link to="/signin">sign in</Link>
            </StyledP>
          </StyledSignup>
          <p>or</p>
          <StyledGoogleButton name="googleSignIn" onClick={handleClick}>
            Sign up with google
          </StyledGoogleButton>
        </>
      )}
    </div>
  );
}

export default Signup;
