import React from "react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firebase";
import styled from "styled-components";
import { Button, Form } from "react-bootstrap";
import NewListModal from "./NewListModal";

export const StyledBook = styled.div`
  margin: 0 auto;
  background-color: green;
  padding: 5px;
  flex-grow: 1;
`;

export const StyledContainer = styled.div`
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

  useEffect(() => {
    const getBooksfromDb = db.collection(
      `users/${user_UID}/booklist_${user_UID}`
    );

    getBooksfromDb.onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => ({
        title: doc.id,
        ...doc.data(),
      }));
      setList(data);
    });
  }, []);

  function handleChange(e) {
    setSearchInput(e.currentTarget.value);
  }

  function handleSearch(e) {
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

  /// SO THIS WILL CREATE A COLLECTION
  function addOrRemoveFromList(e) {
    const book_ID = db
      .collection("users")
      .doc(`${user_UID}`)
      .collection(`booklist_${user_UID}`)
      .doc(`${e.volumeInfo.title}`);

    book_ID.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        book_ID
          .delete()
          .then(() => console.log("book deleted"))
          .catch(error => console.error("could not delete book" + error));

        setList(list.filter(book => book.title !== book_ID));
      } else {
        book_ID
          .set({
            title: e.volumeInfo.title,
            thumbnail: e.volumeInfo.imageLinks.thumbnail,
          })
          .then(() => {
            console.log("doc successfully written");
          })
          .catch(error => {
            console.error("error writing doc: ", error);
          });

        setList(prev => [
          ...prev,
          {
            title: e.volumeInfo.title,
            thumbnail_URL: e.volumeInfo.imageLinks.thumbnail,
          },
        ]);
      }
    });
  }

  //////////////////////////
  if (list.length) {
    console.log(list);
  }
  //////////////////////////
  const [focusedShelf, setFocusedShelf] = useState(`booklist_${user_UID}`);
  const [isShelfPrivate, setIsShelfPrivate] = useState(false);
  const [popUpModal, setPopUpModal] = useState(false);

  // change the state if new list is slected. that state will conditionally render
  // the new list form component i need to make;
  function handleSelectChange(e) {
    const selectedShelf = e.target.value;
    if (selectedShelf === "Create New List") {
      setPopUpModal(true);
    }
  }

  console.log(focusedShelf);

  return (
    <div>
      <h1>Search Books</h1>
      <form onSubmit={handleSearch} key={formKey}>
        <input value={searchInput} onChange={handleChange}></input>
        <button type="submit">search</button>
      </form>
      {!popUpModal ? (
        <>
          <label for="bookLists">Add books to</label>
          <select
            name="bookLists"
            /* value={myList} */
            id="bookLists"
            onChange={handleSelectChange}
          >
            <option value="My List">My List</option>
            <option value="Create New List">Create New List</option>
          </select>
          <button>create new list</button>
        </>
      ) : (
        <>
          <NewListModal
            user_UID={user_UID}
            setFocusedShelf={setFocusedShelf}
            isShelfPrivate={isShelfPrivate}
            setIsShelfPrivate={setIsShelfPrivate}
          />
        </>
      )}
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
