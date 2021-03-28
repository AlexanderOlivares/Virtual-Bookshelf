import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StyledBook, StyledContainer } from "./Search";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { db, auth, google } from "./firebase";
import Modal from "react-modal";
import { StyledGoogleButton } from "./Signup";
import { FcGoogle } from "react-icons/fc";
import { FaBookReader } from "react-icons/fa";
import { FiUserCheck } from "react-icons/fi";
Modal.setAppElement("#root");

const StyledAbout = styled.p`
  margin: 0 auto;
  max-width: 75%;
  padding: 20px;
`;

export const StyledActiveUser = styled.p`
  font-size: 16px;
  display: inline;
  padding: 10px;
`;

const StyledHomeButtons = styled.button`
  display: inline;
  margin: 20px;
  padding: 5px;
`;

function Home({ isLoggedIn, username, user_UID }) {
  const NYT_API_KEY = process.env.REACT_APP_NYT_BESTSELLERS_API_KEY;

  const [bestsellersList, setBestsellersList] = useState([]);
  const [homeList, setHomeList] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(-1);

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
        console.log(res.results.books);
        setBestsellersList(res.results.books);
      })
      .catch(error => console.error(`error: ${error}`));
  }, []);

  function addOrRemoveFromList(book) {
    const book_ID = db
      .collection("users")
      .doc(`${user_UID}`)
      .collection(`shelf`)
      .doc(`${book.title}`);

    console.log(book.title);
    book_ID.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        book_ID
          .delete()
          .then(() => console.log("book deleted"))
          .catch(error => console.error("could not delete book" + error));

        setHomeList(homeList.filter(e => e.title !== book.title));
      } else {
        book_ID
          .set({
            title: book.title,
            author: book.author,
            thumbnail: book.book_image,
            description: book.description,
          })
          .then(() => {
            console.log("doc successfully written");
          })
          .catch(error => {
            alert("Please sign in or create an account to create your shelf");
            console.error("error writing doc: ", error);
          });

        setHomeList(prev => [
          ...prev,
          {
            title: book.title,
            author: book.author,
            thumbnail: book.book_image,
            description: book.description,
          },
        ]);
      }
    });
  }

  function renderModal(modalIndex) {
    let modalTargetBook = bestsellersList[modalIndex];
    return (
      modalTargetBook && (
        <Modal
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0.75)",
            },
            content: {
              position: "absolute",
              top: "40px",
              left: "40px",
              right: "40px",
              bottom: "40px",
              border: "1px solid #ccc",
              background: "#fff",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "4px",
              outline: "none",
              textAlign: "center",
              padding: "20px",
            },
          }}
          isOpen={modal}
          modalIndex={modalIndex}
          onRequestClose={() => toggleModal()}
        >
          <img
            src={modalTargetBook.book_image}
            alt={modalTargetBook.title}
            width="250"
            // width="128"
            // height="195"
          ></img>
          <p>{modalTargetBook.description}</p>
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

  function handleClick() {
    auth
      .signInWithPopup(google)
      .then(result => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in username info.
        var userCredential = result.user;
        return db.collection("users").doc(result.user.uid).set({
          username: result.user.displayName,
          email: result.user.email,
          uid: result.user.uid,
        });
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        alert(`could not signup: ${errorCode}${errorMessage}`);
        console.log([errorCode, errorMessage, credential, email]);
      });
  }

  return (
    <div>
      {isLoggedIn ? (
        <>
          <div>
            <FiUserCheck />
            <StyledActiveUser>{`${username}`}</StyledActiveUser>
          </div>
          <StyledHomeButtons>
            <Link to="/shelf">go to my shelf</Link>
          </StyledHomeButtons>
          <StyledHomeButtons>
            <Link to="/search">search all books</Link>
          </StyledHomeButtons>
        </>
      ) : (
        <>
          <h1 style={{ padding: 10 }}>My Virtual Bookshelf</h1>
          <FaBookReader size={72}></FaBookReader>
          <StyledAbout>
            Do you love e-books and audiobooks but miss putting finished books
            on your bookshelf? Now you have a digital shelf to display your
            collection. Create your virtual bookshelf and show people what
            you've been reading!
            <br></br>
          </StyledAbout>
          <div>
            <h5>Create an Account or sign up with Google</h5>
            <StyledGoogleButton>
              <Link to="/signup">Sign up</Link>
            </StyledGoogleButton>
            <StyledGoogleButton name="googleSignIn" onClick={handleClick}>
              {<FcGoogle />} Sign up with Google
            </StyledGoogleButton>
          </div>
        </>
      )}
      <br></br>
      <div>
        <h3>What have you read lately?</h3>
        <h5>NYT Best Sellers</h5>
        {!bestsellersList.length
          ? "loading..."
          : bestsellersList.map((book, index) => {
              return (
                <StyledBook key={uuidv4()}>
                  <img src={book.book_image} alt={book.title}></img>
                  <div>{book.title}</div>
                  <div>{book.contributor}</div>
                  <div>Rank: {book.rank}</div>
                  <button onClick={() => toggleModal(index)}>info</button>
                  {isLoggedIn && (
                    <button onClick={() => addOrRemoveFromList(book)}>
                      {homeList.some(
                        x => x.title === book.title && x.author === book.author
                      )
                        ? "remove from list"
                        : "add to list"}
                    </button>
                  )}
                </StyledBook>
              );
            })}
      </div>
      {renderModal(modalIndex)}
      <StyledAbout style={{ marginBottom: -15 }}>
        Create an account to add books to your shelf
      </StyledAbout>
      <StyledHomeButtons>
        <Link to="/signup">Sign up</Link>
      </StyledHomeButtons>
    </div>
  );
}

export default Home;
