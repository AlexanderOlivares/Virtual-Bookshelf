import "./App.css";
import { useState } from "react";
import auth from "./firebase";

function App() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  console.log(input.password);

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

    auth
      .createUserWithEmailAndPassword(input.email, input.password)
      .then(userCredential => {
        let user = userCredential.user;
        console.log(user);
      })
      .catch(error => {
        console.log(error.code);
        console.log(error.message);
      });
  }

  // const firebaseApp = firebase.apps[0];

  return (
    <div className="App">
      <form>
        <h1>Sign Up!</h1>
        <input name="email" onChange={handleChange}></input>
        <br></br>
        <input name="password" type="password" onChange={handleChange}></input>
        <br></br>
        <button onSubmit={handleSubmit}>sign in</button>
      </form>
    </div>
  );
}

export default App;
