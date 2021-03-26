import React from "react";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledNav = styled.nav`
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  font-size: 20px;
  background-color: red;
`;

function Navbar({ setIsLoggedIn, isLoggedIn, setUsername, setUserEmail }) {
  function handleLogout() {
    auth
      .signOut()
      .then(() => {
        setIsLoggedIn(null);
        setUsername("");
        setUserEmail(null);
      })
      .catch(error => {
        console.log(`Could not log out ${error}`);
      });
  }

  return (
    <StyledNav>
      <span style={{ padding: 10 }}>
        <Link to="/">home</Link>
      </span>
      <span style={{ padding: 10 }}>
        <Link to="/shelf">shelf</Link>
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
    </StyledNav>
  );
}

export default Navbar;
