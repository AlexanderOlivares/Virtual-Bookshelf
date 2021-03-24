import React from "react";
import { useState } from "react";
import { db, auth, google } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import Home from "./Home";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Search from "./Search";
import Modal from "react-modal";

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
  const [modal, setModal] = useState(false);

  const [resetPassInupt, setResetPassInput] = useState("");

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

    let reg = /^.{6,25}$/g;

    if (!reg.test(password)) {
      alert("password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      alert("passwords do not match");
      return;
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

  // function toggleModal() {
  //   setModal(prev=> !prev);
  // }

  function renderModal() {
    return (
      <Modal isOpen={modal} onRequestClose={() => setModal(false)}>
        <StyledSignup onSubmit={resetPassword}>
          <h3>Password Reset</h3>
          <p>An email with reset instructions will be sent to:</p>
          <input
            onChange={handlePassInput}
            placeholder="yourname@email.com"
            type="email"
            name="email"
          ></input>
          <br></br>
          <button type="submit">send email</button>
          <button onClick={() => setModal(false)}>cancel</button>
        </StyledSignup>
      </Modal>
    );
  }

  function handlePassInput(e) {
    setResetPassInput(e.currentTarget.value);
  }

  function resetPassword(e) {
    e.preventDefault();
    const resetEmail = resetPassInupt;
    auth
      .sendPasswordResetEmail(resetEmail)
      .then(function () {
        // Email sent.
        alert("check your email for reset instructions");
        console.log("check your email for reset instructions");
        setModal(false);
      })
      .catch(function (error) {
        // An error happened
        alert(error + "could not send reset password email");
        console.error(error + "could not send reset password email");
      });
  }

  return (
    <>
      <div>
        {isLoggedIn ? (
          <>
            <Search username={username} />
          </>
        ) : (
          <>
            <StyledSignup key={formKey} onSubmit={handleSubmit}>
              <StyledInput
                required
                minLength="2"
                maxLength="25"
                name="username"
                placeholder="pick a username"
                onChange={handleChange}
              ></StyledInput>
              <br></br>
              <StyledInput
                type="email"
                required
                minLength="6"
                maxLength="50"
                name="email"
                placeholder="your email"
                onChange={handleChange}
              ></StyledInput>
              <br></br>
              <StyledP>Password must be at least 6 characters long</StyledP>
              <StyledInput
                required
                placeholder="create a password"
                name="password"
                type="password"
                onChange={handleChange}
              ></StyledInput>
              <StyledInput
                required
                placeholder="confirm your password"
                name="confirmPassword"
                type="password"
                onChange={handleChange}
              ></StyledInput>
              <br></br>
              <button type="submit">create my account</button>
              <br></br>
              <StyledP>Already have an account?</StyledP>
              <StyledP>
                <Link to="/signin">sign in</Link>
              </StyledP>
            </StyledSignup>
            <button onClick={() => setModal(true)}>reset passowrd</button>
            <p>or</p>
            <StyledGoogleButton name="googleSignIn" onClick={handleClick}>
              Sign up with google
            </StyledGoogleButton>
          </>
        )}
      </div>
      <div>{renderModal()}</div>
    </>
  );
}

export default Signup;
