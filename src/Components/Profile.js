import React from "react";
import Signup from "./Signup";

function Profile({ username, isLoggedIn }) {
  // let displayNameOrEmail =
  //   username !== null && username.split("").includes("@")
  //     ? username.match(/^\w+(?=@)/g).join("") || username
  //     : username;
  // console.log(username);
  return (
    <>
      {isLoggedIn || isLoggedIn === undefined ? (
        <div>
          <h3>{`Welcome ${username}`}</h3>
          <p>{`get started by creating a club and inviting frineds to join!`}</p>
        </div>
      ) : (
        <div>
          <h3>{"Log in to view your profile"}</h3>
          <Signup />
        </div>
      )}
    </>
  );
}

export default Profile;
