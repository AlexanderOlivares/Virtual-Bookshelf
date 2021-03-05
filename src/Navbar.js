import React from "react";
import { auth } from "./firebase";
import { Link } from "react-router-dom";

function Navbar({ setIsLoggedIn, isLoggedIn }) {
  function handleLogout() {
    // set logout method
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        setIsLoggedIn(false);
        console.log("successful logout");
      })
      .catch(error => {
        // An error happened.
        console.log(error);
      });
  }

  return (
    <div>
      <span style={{ padding: 10 }}>
        <Link to="/list">List</Link>
      </span>
      <span style={{ padding: 10 }}>
        <Link to="/search">Search</Link>
      </span>
      <span style={{ padding: 10 }}>
        <Link to="/profile">profile</Link>
      </span>
      {isLoggedIn ? (
        <button style={{ padding: 5 }} onClick={handleLogout}>
          <Link to="/">Sign Out</Link>
        </button>
      ) : (
        <button style={{ padding: 5 }}>
          <Link to="/signin">Sign in</Link>
        </button>
      )}
    </div>
  );
}

export default Navbar;
