import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
      <h1>Book Club App</h1>
      <p>
        start a virtual book club with your friends no matter where they are!
      </p>
      <button>
        <Link to="/signup">Sign up now!</Link>
      </button>
    </div>
  );
}

export default LandingPage;
