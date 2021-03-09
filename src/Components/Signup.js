import React from "react";
import { useState } from "react";
import { auth, google } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import Profile from "./Profile";

function Signup({ user, isLoggedIn, setIsLoggedIn, setUser }) {
  const [input, setInput] = useState({
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
    const email = input.email;
    const password = input.password;
    const confirmPassword = input.confirmPassword;

    if (password !== confirmPassword) {
      alert("passwords do not match");
    }

    setInput({
      email: "",
      password: "",
    });

    setFormKey(uuidv4());

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        let user = userCredential.user;
        setUser(email);
        setIsLoggedIn(true);
        console.log(user);
        console.log(isLoggedIn);
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
        // The signed-in user info.
        var googleUser = result.user;
        // ...
        console.log([token, googleUser]);
        setIsLoggedIn(true);
        setUser(googleUser.email);
      })
      .catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        alert(`${errorCode}${errorMessage}`);
        console.log([errorCode, errorMessage, credential, email]);
        // ...
      });
  }

  return (
    <div>
      {isLoggedIn ? (
        <>
          <Profile user={user} />
        </>
      ) : (
        <>
          <form key={formKey} onSubmit={handleSubmit}>
            <button name="googleSignIn" onClick={handleClick}>
              Sign up with google
            </button>
            <h4>sign up!</h4>
            <p>email</p>
            <input
              name="email"
              placeholder="your email"
              onChange={handleChange}
            ></input>
            <p>password</p>
            <input
              placeholder="create a password"
              name="password"
              type="password"
              onChange={handleChange}
            ></input>
            <p>confirm password</p>
            <input
              placeholder="confirm your password"
              name="confirmPassword"
              type="password"
              onChange={handleChange}
            ></input>
            <br></br>
            <button>create my account</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Signup;
