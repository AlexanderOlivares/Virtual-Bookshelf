import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { auth, google } from "./firebase";

function SignIn({ isLoggedIn, setIsLoggedIn, user, setUser }) {
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
        let user = userCredential.user;
        setUser(email);
        setIsLoggedIn(true);
        console.log(user);
        console.log(isLoggedIn);
      })
      .catch(error => {
        alert(`could sign in ${error.code}`);
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
      {!isLoggedIn ? (
        <div>
          <form key={formKey} onSubmit={handleSubmit}>
            <h4>sign up!</h4>
            <p>email</p>
            <input name="email" onChange={handleChange}></input>
            <br></br>
            <p>password</p>
            <input
              name="password"
              type="password"
              onChange={handleChange}
            ></input>
            <button>sign in</button>
          </form>
          <button name="googleSignIn" onClick={handleClick}>
            Sign up with google
          </button>
        </div>
      ) : (
        <h2>welcome back you've signed in.</h2>
      )}
    </div>
  );
}

export default SignIn;

{
  /* <br></br>
        <button name="googleSignIn" onClick={handleClick}>
          Sign in with google
        </button> */
}
