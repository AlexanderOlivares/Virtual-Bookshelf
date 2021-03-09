import React from "react";
import Signup from "./Signup";

function Profile({ user, isLoggedIn }) {
  console.log(isLoggedIn);
  return (
    <>
      {isLoggedIn || isLoggedIn === undefined ? (
        <div>
          <h3>{`Welcome ${user}`}</h3>
          <p>{`get started by creating a club and inviting frineds to join!`}</p>
        </div>
      ) : (
        <div>
          <h3>{"Log in to view your profile"}</h3>
          <p>{"or sign up with Google"}</p>
          <Signup />
        </div>
      )}
    </>
  );
}

export default Profile;
