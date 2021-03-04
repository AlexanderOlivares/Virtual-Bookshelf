import React from "react";
import { auth } from "./firebase";

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
      <span style={{ padding: 10 }}>List</span>
      <span style={{ padding: 10 }}>Profile</span>
      {isLoggedIn ? (
        <button style={{ padding: 5 }} onClick={handleLogout}>
          sign out
        </button>
      ) : (
        <button style={{ padding: 5 }}>sign in</button>
      )}
    </div>
  );
}

export default Navbar;
