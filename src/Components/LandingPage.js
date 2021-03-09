import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
      <h1>My Virtual Bookshelf</h1>
      <p>
        Always read E-books? Only listen audiooks? Now you have a place to
        display your collection. Start a virtual Bookshelf and share what you're
        reading with friends no matter where they are!
      </p>
      <div>
        <hr></hr>
        <h5>Create an Account or sign up with Google</h5>
        <button>
          <Link to="/signup">Sign up now!</Link>
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
