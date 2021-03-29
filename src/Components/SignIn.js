import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { auth, google } from "./firebase";
import Home from "./Home";
import { FaBookReader } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Modal from "react-modal";
import { lightTheme, darkTheme } from "./Theme";
import {
  StyledGoogleButton,
  StyledButton,
  StyledInput,
  StyledSignup,
  StyledP,
  StyledCard,
} from "./Signup";

function SignIn({ isLoggedIn, setIsLoggedIn, username, setUsername, theme }) {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [modal, setModal] = useState(false);
  const [resetPassInupt, setResetPassInput] = useState("");
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

  function renderModal() {
    return (
      <Modal
        theme={theme}
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          },
          content: {
            background: theme.background,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "auto",
            webkitoverflowscrolling: "touch",
            textAlign: "center",
            padding: "20px",
          },
        }}
      >
        <StyledSignup onSubmit={resetPassword}>
          <h3>Password Reset</h3>
          <p>An email with reset instructions will be sent to:</p>
          <input
            style={{ margin: 20 }}
            onChange={handlePassInput}
            placeholder="yourname@email.com"
            type="email"
            name="email"
          ></input>
          <br></br>
          <button type="submit" style={{ margin: 5 }}>
            send email
          </button>
          <button onClick={() => setModal(false)} style={{ margin: 5 }}>
            cancel
          </button>
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
            {<FcGoogle size={25} />} Sign up with Google
          </StyledGoogleButton>
          {/* <StyledCard> */}
          <div>
            <p>
              Forgot Your Password?
              <br></br>
              <StyledButton onClick={() => setModal(true)}>
                reset password
              </StyledButton>
            </p>
            {/* </StyledCard> */}
          </div>
          <div>{renderModal()}</div>
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
