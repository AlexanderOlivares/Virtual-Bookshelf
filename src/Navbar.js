import React from "react";

function Navbar({ user }) {
  return (
    <div>
      <span style={{ padding: 10 }}>List</span>
      <span style={{ padding: 10 }}>Profile</span>
      {user ? (
        <button style={{ padding: 5 }}>sign out</button>
      ) : (
        <button style={{ padding: 5 }}>sign in</button>
      )}
    </div>
  );
}

export default Navbar;
