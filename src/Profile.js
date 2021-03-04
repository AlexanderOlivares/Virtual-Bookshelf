import React from "react";

function Profile({ user }) {
  return (
    <div>
      <h3>{`Welcome ${user}`}</h3>
      <p>{`get started by inviting frineds to your book club!`}</p>
    </div>
  );
}

export default Profile;
