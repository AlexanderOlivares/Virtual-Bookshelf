import React from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firebase";
import styled from "styled-components";

const StyledBook = styled.div`
  margin: 0 auto;
  background-color: green;
  padding: 5px;
  flex-grow: 1;
`;

const StyledContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: stretch;
  align-items: center;
  background-color: dodgerblue;
`;

function Search({ user_UID }) {
  const API_KEY = process.env.REACT_APP_FIREBASE_GOOGLE_BOOKS_API_KEY;
  const [searchInput, setSearchInput] = useState("");
  const [book, setBook] = useState([]);
  const [formKey, setFormKey] = useState(uuidv4());
  const [list, setList] = useState([]);

  function handleChange(e) {
    setSearchInput(e.currentTarget.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

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
      .then(jsonRes => {
        let booksWithImageLinks = jsonRes.items.filter(
          e => e.volumeInfo.imageLinks
        );
        setBook(booksWithImageLinks);
      })
      .catch(error => {
        console.log("error: ", error);
      });
    setFormKey(uuidv4());
  }

  ////////////////////////////////////////////////////////////////
  // db.collection("test/doc_id/booklist/user_UID")

  // db.collection("test")
  //   .document("doc_id")
  //   .collection("items")

  //  dont even use handleAddBook just do it per each book not all at once
  ////////////////////////////////////////////////////////////////

  /// SO THIS WILL CREATE A COLLECTION
  function handleAddBook() {
    db.collection(`users`)
      .doc(`${user_UID}`)
      .collection(`booklist_${user_UID}`)
      .add({
        data: "test data i wrote",
      })
      .then(() => {
        console.log("doc successfully written");
      })
      .catch(error => {
        console.error("error writing doc: ", error);
      });
  }

  /////////////////////////////////////
  // func below should handle the reading/ writing to db for indivindalu books
  /////////////////////////////////////

  function addOrRemoveFromList(e) {
    db.collection("users")
      .doc(`${user_UID}`)
      .collection(`booklist_${user_UID}`)
      .get()
      .then(snapshot => {
        console.log("doc successfully written");
      })
      .catch(error => {
        console.error("error writing doc: ", error);
      });
  }

  //////////////////////////
  if (list.length) {
    console.log(list);
  }
  //////////////////////////

  return (
    <div>
      <h1>Search Books</h1>
      <form onSubmit={handleSubmit} key={formKey}>
        <input value={searchInput} onChange={handleChange}></input>
        <button type="submit">search</button>
      </form>
      <button onClick={handleAddBook}>save list</button>
      <StyledContainer>
        {book &&
          book.map(e => {
            return (
              <StyledBook key={uuidv4()}>
                <img
                  src={e.volumeInfo.imageLinks.thumbnail}
                  alt={e.volumeInfo.title}
                ></img>
                <br></br>
                <button onClick={() => addOrRemoveFromList(e)}>
                  {list.some(x => x.title === e.volumeInfo.title)
                    ? "remove from list"
                    : "add to list"}
                </button>
              </StyledBook>
            );
          })}
      </StyledContainer>
    </div>
  );
}

export default Search;
// {/* .filter(e => e.volumeInfo.imageLinks) */}
// {list.includes(e.volumeInfo.title)

// function addOrRemoveFromList(e) {
//   if (list.includes(e.volumeInfo.title)) {
//     setList(list.filter(book => book !== e.volumeInfo.title));
//   } else {
//     setList(prev => [...prev, e.volumeInfo.title]);
//   }
// }

////////////////////////////////////
// db.collection("cities")
//   .doc("SF")
//   .onSnapshot(doc => {
//     console.log("Current data: ", doc.data());
//   });
//////////////////////////

// if (list.some(x => x.title === e.volumeInfo.title)) {
//   setList(list.filter(book => book.title !== e.volumeInfo.title));
// } else {
//   setList(prev => [
//     ...prev,
//     {
//       title: e.volumeInfo.title,
//       thumbnail_URL: e.volumeInfo.imageLinks.thumbnail,
//     },
//   ]);
// }
