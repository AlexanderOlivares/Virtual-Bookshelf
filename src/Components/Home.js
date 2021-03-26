import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StyledBook, StyledContainer } from "./Search";
import { v4 as uuidv4 } from "uuid";
import { db, auth, google } from "./firebase";
import Modal from "react-modal";
import { StyledGoogleButton } from "./Signup";
Modal.setAppElement("#root");

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

        // THIS LINE COULD BE TROUBLE
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
          isOpen={modal}
          modalIndex={modalIndex}
          onRequestClose={() => toggleModal()}
        >
          <img
            src={modalTargetBook.book_image}
            alt={modalTargetBook.title}
            width="128"
            height="195"
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
        <div>
          <p>{`user icon ${username}`}</p>
          <button>go to my shelf</button>
          <button>search all books</button>
        </div>
      ) : (
        <>
          <h1>My Virtual Bookshelf</h1>
          <p>
            Do you love e-books and audiobooks but miss putting finished books
            on your bookshelf? Now you have a digital shelf to display your
            collection.
          </p>
          <div>
            <hr></hr>
            <h5>Create an Account or sign up with Google</h5>
            <button>
              <Link to="/signup">Sign up now!</Link>
            </button>
            <StyledGoogleButton name="googleSignIn" onClick={handleClick}>
              Sign up with google
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
    </div>
  );
}

export default Home;
