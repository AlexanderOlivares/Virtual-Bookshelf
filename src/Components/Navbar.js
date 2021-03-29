import React from "react";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { GiBookshelf } from "react-icons/gi";
import { GoSearch, GoHome } from "react-icons/go";
import { FaSun, FaMoon } from "react-icons/fa";
import { lightTheme, darkTheme } from "./Theme";

const StyledNav = styled.nav`
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  font-size: 20px;
  background-color: #00adb5;
  padding: 15px;
`;

const StyledNavItem = styled.span`
  padding: 10px;
  margin: 10px;
`;

const StyledNavButton = styled.button`
  border: none;
  background-color: #eeeeee;
  border: 2px solid #222831;
  font-size: 14px;
  margin-left: 5px;
  padding: 5px;
  border-radius: 5px;
`;

function Navbar({
  theme,
  setTheme,
  setIsLoggedIn,
  isLoggedIn,
  setUsername,
  setUserEmail,
}) {
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

  function handleThemeToggle() {
    let updatedTheme = theme === darkTheme ? lightTheme : darkTheme;
    setTheme(updatedTheme);
  }

  return (
    <StyledNav>
      <StyledNavItem>
        <Link to="/">{<GoHome />}</Link>
      </StyledNavItem>
      <StyledNavItem>
        <Link to="/shelf">{<GiBookshelf />}</Link>
      </StyledNavItem>
      <StyledNavItem onClick={handleThemeToggle}>
        {theme === lightTheme ? <FaMoon /> : <FaSun />}
      </StyledNavItem>
      <StyledNavItem>
        <Link to="/search">{<GoSearch />}</Link>
      </StyledNavItem>
      {isLoggedIn ? (
        <StyledNavButton onClick={handleLogout}>
          <Link to="/">Sign Out</Link>
        </StyledNavButton>
      ) : (
        <StyledNavButton>
          <Link to="/signin">Sign in</Link>
        </StyledNavButton>
      )}
    </StyledNav>
  );
}

export default Navbar;
