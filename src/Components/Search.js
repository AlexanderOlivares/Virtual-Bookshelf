import React from "react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firebase";
import Modal from "react-modal";
import styled from "styled-components";
import { StyledActiveUser } from "./Home";
import { modalStyles } from "./GlobalStyle";
import { FiUserCheck } from "react-icons/fi";
import { AiOutlineDelete, AiOutlineClose } from "react-icons/ai";
import { BiInfoSquare } from "react-icons/bi";
import { ImSearch } from "react-icons/im";

export const StyledBook = styled.div`
  margin-top: 35px;
  flex-grow: 1;
`;

export const StyledContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: stretch;
  align-items: center;
  padding: 5px;

  @media (min-width: 900px) {
    max-width: 65%;
  }

  @media (min-width: 2500px) {
    max-width: 45%;
  }
`;

function Search({ user_UID, isLoggedIn, username, theme }) {
  const API_KEY = process.env.REACT_APP_FIREBASE_GOOGLE_BOOKS_API_KEY;
  modalStyles.content.background = theme.background;

  const [searchInput, setSearchInput] = useState("");
  const [googleBooksResults, setGoogleBooksResults] = useState([]);
  const [formKey, setFormKey] = useState(uuidv4());
  const [list, setList] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(-1);

  // will show if a book in search results is already saved in db
  useEffect(() => {
    const getBooksfromDb = db.collection(`users/${user_UID}/shelf`);

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
    console.log(searchInput);
    if (!searchInput.length) {
      alert(
        "Your search box is empty. Type a book title or author to do a search."
      );
      return;
    }

    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${searchInput}&key=${API_KEY}&maxResults=40`
    )
      .then(res => {
        if (!res.ok) {
          alert("Error getting books from Google Books" + res);
        }
        if (res.ok) {
          return res.json();
        }
      })
      .then(jsonRes => {
        let booksWithImageLinks = jsonRes.items.filter(
          book =>
            book.volumeInfo.imageLinks &&
            book.volumeInfo.description &&
            book.volumeInfo.authors
        );
        setGoogleBooksResults(booksWithImageLinks);
      })
      .catch(error => {
        alert(`Error coult not fetch books ${error}`);
      });

    setFormKey(uuidv4());
  }

  // creates a shelf collection under the user document in firebase
  function toggleFromList(bookToToggle) {
    const book_ID = db
      .collection("users")
      .doc(`${user_UID}`)
      .collection(`shelf`)
      .doc(`${bookToToggle.volumeInfo.title}`);

    book_ID.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        book_ID
          .delete()
          .then(() => console.log("book deleted"))
          .catch(error => console.error("could not delete book" + error));

        setList(
          list.filter(
            book =>
              book.title !== bookToToggle.volumeInfo.title &&
              book.description !== bookToToggle.volumeInfo.description
          )
        );
      } else {
        book_ID
          .set({
            title: bookToToggle.volumeInfo.title,
            author: bookToToggle.volumeInfo.authors.join(", "),
            thumbnail: bookToToggle.volumeInfo.imageLinks.thumbnail,
            description: bookToToggle.volumeInfo.description,
          })
          .then(() => {
            console.log("book successfully saved");
          })
          .catch(error => {
            alert(
              "Please sign in or create an account to add books to your shelf"
            );
            console.error("error writing doc: ", error);
          });

        // add new books to state
        setList(prev => [
          ...prev,
          {
            title: bookToToggle.volumeInfo.title,
            author: bookToToggle.volumeInfo.authors,
            thumbnail: bookToToggle.volumeInfo.imageLinks.thumbnail,
            description: bookToToggle.volumeInfo.description,
          },
        ]);
      }
    });
  }

  function renderModal(modalIndex) {
    let modalTargetBook = googleBooksResults[modalIndex];
    return (
      modalTargetBook && (
        <Modal
          theme={theme}
          style={modalStyles}
          isOpen={modal}
          modalIndex={modalIndex}
          onRequestClose={() => toggleModal()}
        >
          <button
            style={{ position: "absolute", top: 5, left: 5, border: "none" }}
            onClick={() => toggleModal()}
          >
            <AiOutlineClose size={20} />
          </button>
          <div>
            <img
              src={modalTargetBook.volumeInfo.imageLinks.thumbnail}
              alt={modalTargetBook.volumeInfo.title}
            ></img>
          </div>
          <div>
            <p>{modalTargetBook.volumeInfo.description}</p>
            <p>{`by ${modalTargetBook.volumeInfo.authors.join(", ")}`}</p>
          </div>
          <div>
            <button onClick={() => toggleModal()}>close</button>
          </div>
        </Modal>
      )
    );
  }

  function toggleModal(index = -1) {
    setModalIndex(index);
    setModal(prev => !prev);
  }

  return (
    <div>
      {isLoggedIn && (
        <div>
          <FiUserCheck />
          <StyledActiveUser>{`${username}`}</StyledActiveUser>
        </div>
      )}
      <h1>Search Books</h1>
      {!googleBooksResults.length && (
        <ImSearch size={170} style={{ margin: 20 }} />
      )}
      {!isLoggedIn && (
        <h4>
          Search by title or author. Sign in or create an account to add books
          to your shelf.
        </h4>
      )}
      <form onSubmit={handleSearch} key={formKey}>
        <input value={searchInput} onChange={handleChange}></input>
        <button style={{ fontSize: 16, margin: 10 }} type="submit">
          search
        </button>
      </form>
      <StyledContainer>
        {googleBooksResults &&
          googleBooksResults.map((currentBook, index) => {
            return (
              <StyledBook key={uuidv4()}>
                <img
                  width="128"
                  height="195"
                  src={currentBook.volumeInfo.imageLinks.thumbnail}
                  alt={currentBook.volumeInfo.title}
                ></img>
                <br></br>
                <button onClick={() => toggleModal(index)}>
                  {<BiInfoSquare />}
                </button>
                {isLoggedIn && (
                  <button onClick={() => toggleFromList(currentBook)}>
                    {list.filter(
                      book =>
                        book.description === currentBook.volumeInfo.description
                    ).length ? (
                      <AiOutlineDelete />
                    ) : (
                      "add to shelf"
                    )}
                  </button>
                )}
              </StyledBook>
            );
          })}
      </StyledContainer>
      {renderModal(modalIndex)}
    </div>
  );
}

export default Search;
