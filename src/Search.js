import React from "react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firebase";

function Search() {
  const API_KEY = process.env.REACT_APP_FIREBASE_GOOGLE_BOOKS_API_KEY;
  const [searchInput, setSearchInput] = useState("");
  const [book, setBook] = useState([]);
  const [formKey, setFormKey] = useState(uuidv4());
  const [checked, setChecked] = useState(false);
  const [list, setList] = useState([]);

  function handleChange(e) {
    setSearchInput(e.currentTarget.value);
  }
  
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

  function handleAddBook(){
     db.collection('test').add({
       data: list,
     }).then(()=> {
       console.log('doc successfully written');
     }).catch((error)=> {
       console.error('error writing doc: ', error)
     })
  }

  console.log(list);
  return (
    <div>
      <h1>Search Books</h1>
      <form onSubmit={handleSubmit} key={formKey}>
        <input value={searchInput} onChange={handleChange}></input>
        <button type="submit">search</button>
      </form>
      <button onClick={handleAddBook}>save list</button>

      {book &&
        book
          .filter(e => e.volumeInfo.imageLinks)
          .map(e => {
            return (
              <>
              <span key={uuidv4()}>
                <img
                  src={e.volumeInfo.imageLinks.thumbnail}
                  alt={e.volumeInfo.title}
                ></img>
                <button onClick={()=> setList(p=> [...p, e.volumeInfo.title])}>
                add to list
                </button>
              </span>
              </>
            );
          })}
    </div>
  );
}

export default Search;
