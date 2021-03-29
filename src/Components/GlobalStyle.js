import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html, body {
    background: ${props => props.theme.background};
    color: ${props => props.theme.color}; 
    transition: all .3s ease;
  }

  h1, h2, h3, h4, h5, h6 {
    text-align: center;
    width: 85%;
    margin: 0 auto;
    padding: 30px;
  }

  a { 
    color: #1b262c;
    text-decoration: none;
  }

  button {
    border-radius: 5px;
    margin: 5px;
    border: 2px solid #222831;
    background-color: #eeeeee;
  }
 `;
