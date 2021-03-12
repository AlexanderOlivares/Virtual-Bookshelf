import React from "react";
import Signup from "./Signup";

function Profile({ username, isLoggedIn }) {
  return (
    <>
      {isLoggedIn || isLoggedIn === undefined ? (
        <div>
          <h3>{`Welcome ${username}`}</h3>
          <p>{`get started by creating a club and inviting frineds to join!`}</p>
        </div>
      ) : (
        <div>
          <h3>{"Create an account and build your profile!"}</h3>
          <Signup />
        </div>
      )}
    </>
  );
}

export default Profile;
