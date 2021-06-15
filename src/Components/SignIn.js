import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { auth, google } from "./firebase";
import Home from "./Home";
import { FaBookReader } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Modal from "react-modal";
import { modalStyles } from "./GlobalStyle";
import {
  StyledGoogleButton,
  StyledButton,
  StyledInput,
  StyledSignup,
  StyledP,
} from "./Signup";

function SignIn({ isLoggedIn, setIsLoggedIn, username, theme }) {
  modalStyles.content.background = theme.background;

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

  function handleSignin(e) {
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
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch(error => {
        alert(`${error}. Could not sign in. Try again or reset your password.`);
        console.log(`${error.code} ${error.message}`);
      });
  }

  function handleGoogleSignin() {
    auth
      .signInWithPopup(google)
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setIsLoggedIn(null);
        alert(`Could not signin: ${errorCode}${errorMessage}`);
      });
  }

  function renderModal() {
    return (
      <Modal
        theme={theme}
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        style={modalStyles}
      >
        <StyledSignup onSubmit={resetPassword}>
          <h3>Password Reset</h3>
          <p>An email with reset instructions will be sent to:</p>
          <input
            style={{ margin: 20 }}
            onChange={handlePasswordInput}
            placeholder="yourname@email.com"
            type="email"
            name="email"
            required
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

  function handlePasswordInput(e) {
    setResetPassInput(e.currentTarget.value);
  }

  function resetPassword(e) {
    e.preventDefault();
    const resetEmail = resetPassInupt;
    auth
      .sendPasswordResetEmail(resetEmail)
      .then(function () {
        alert("check your email for reset instructions");
        setModal(false);
      })
      .catch(function (error) {
        alert(
          error +
            "could not send reset password email. Double check your email address and try again."
        );
        console.error(error + "could not send reset password email");
      });
  }

  return (
    <div>
      {!isLoggedIn ? (
        <div>
          <h1>Sign in</h1>
          <div>
            <FaBookReader size={100} style={{ margin: 30 }}></FaBookReader>
          </div>
          {/* { For signin purposes. Reusing signup styled coponent} */}
          <StyledSignup key={formKey} onSubmit={handleSignin}>
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
          <StyledGoogleButton name="googleSignIn" onClick={handleGoogleSignin}>
            {<FcGoogle size={25} />} Sign in with Google
          </StyledGoogleButton>
          <div>
            <p>
              Forgot Your Password?
              <br></br>
              <StyledButton onClick={() => setModal(true)}>
                reset password
              </StyledButton>
            </p>
          </div>
          <div>{renderModal()}</div>
        </div>
      ) : (
        <>
          <Home isLoggedIn={isLoggedIn} username={username} theme={theme} />
        </>
      )}
    </div>
  );
}

export default SignIn;
