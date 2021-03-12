import React from "react";
import { auth } from "./firebase";
import { Link } from "react-router-dom";

function Navbar({ setIsLoggedIn, isLoggedIn, setUsername }) {
  function handleLogout() {
    auth
      .signOut()
      .then(() => {
        setIsLoggedIn(null);
        setUsername("");
      })
      .catch(error => {
        console.log(`Could not log out ${error}`);
      });
  }

  return (
    <div>
      <span style={{ padding: 10 }}>
        <Link to="/profile">Profile</Link>
      </span>
      <span style={{ padding: 10 }}>
        <Link to="/list">List</Link>
      </span>
      <span>nm</span>
      <span style={{ padding: 10 }}>
        <Link to="/search">Search</Link>
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
