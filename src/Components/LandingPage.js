import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StyledBook, StyledContainer } from "./Search";

function LandingPage({ isloggedIn }) {
  const NYT_API_KEY = process.env.REACT_APP_NYT_BESTSELLERS_API_KEY;

  const [bestsellersList, setBestsellersList] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-nonfiction.json?api-key=${NYT_API_KEY}`
    )
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(res => {
        setBestsellersList(res.results.books);
      })
      .catch(error => console.error(`error: ${error}`));
  }, []);

  console.log(isloggedIn);

  return (
    <div>
      <h2>My Virtual Bookshelf</h2>
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
      <br></br>
      <div>
        <h3> NYT Best Sellers</h3>
        {!bestsellersList.length
          ? "...loading"
          : bestsellersList.map(book => {
              return (
                <StyledBook>
                  <img src={book.book_image} alt={book.title}></img>
                  <div>Title: {book.title}</div>
                  <div>Author: {book.author}</div>
                  <div>Rank: {book.rank}</div>
                </StyledBook>
              );
            })}
      </div>
    </div>
  );
}

export default LandingPage;
