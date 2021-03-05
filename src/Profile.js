import React from "react";

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
          <h3>{"Log in or sign up"}</h3>
          <p>{"login in to view your profile"}</p>
        </div>
      )}
    </>
  );
}

export default Profile;
