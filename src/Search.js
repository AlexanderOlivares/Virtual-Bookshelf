import React from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function Search() {
  const API_KEY = process.env.REACT_APP_FIREBASE_GOOGLE_BOOKS_API_KEY;
  const [searchInput, setSearchInput] = useState("");
  const [book, setBook] = useState([]);
  const [formKey, setFormKey] = useState(uuidv4());

  function handleChange(e) {
    setSearchInput(e.currentTarget.value);
  }

  console.log(API_KEY);

  function handleSubmit(e) {
    e.preventDefault();

    // fetch google api here
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${searchInput}&key=${API_KEY}&maxResults=40`
    )
      .then(res => {
        if (!res.ok) {
          console.log("fetch didn't work", res);
        }
        if (res.ok) {
          console.log("fetch worked");
          return res.json();
        }
      })
      .then(jsonRes => setBook(jsonRes.items))
      .catch(error => {
        console.log("error: ", error);
      });
    setFormKey(uuidv4());
  }
  console.log(book);

  return (
    <div>
      <h1>Search Books</h1>
      <form onSubmit={handleSubmit} key={formKey}>
        <input value={searchInput} onChange={handleChange}></input>
        <button type="submit">search</button>
      </form>

      {book &&
        book
          .filter(e => e.volumeInfo.imageLinks)
          .map(e => {
            return (
              <>
                <img
                  key={uuidv4()}
                  src={e.volumeInfo.imageLinks.thumbnail}
                  alt={e.title}
                ></img>
                <input type="checkBox"></input>
              </>
            );
          })}
    </div>
  );
}

export default Search;
