import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StyledBook } from "./Search";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { db, auth, google } from "./firebase";
import Modal from "react-modal";
import { StyledGoogleButton } from "./Signup";
import { FcGoogle } from "react-icons/fc";
import { FaBookReader } from "react-icons/fa";
import { FiUserCheck } from "react-icons/fi";
import { BiInfoSquare } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import Loader from "react-loader-spinner";
Modal.setAppElement("#root");

// username with checkmark when signed in
export const StyledActiveUser = styled.p`
  font-size: 18px;
  display: inline;
  padding: 10px;
`;

const StyledAbout = styled.p`
  margin: 0 auto;
  max-width: 75%;
  padding: 20px;
`;

const StyledHomeButtons = styled.button`
  display: inline;
  margin: 20px;
  padding: 5px;
`;

function Home({ isLoggedIn, username, user_UID, theme }) {
  const NYT_API_KEY = process.env.REACT_APP_NYT_BESTSELLERS_API_KEY;

  const [bestsellersList, setBestsellersList] = useState([]);
  const [homeList, setHomeList] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(-1);

  useEffect(() => {
    db.collection(`users/${user_UID}/shelf`).onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        setHomeList(prev => [
          ...prev,
          {
            title: data.title,
            thumbnail_URL: data.thumbnail,
            author: data.author,
            description: data.description,
          },
        ]);
      });
    });
  }, []);

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

  function addOrRemoveFromList(book) {
    const book_ID = db
      .collection("users")
      .doc(`${user_UID}`)
      .collection(`shelf`)
      .doc(`${book.title}`);

    book_ID.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        book_ID
          .delete()
          .then(() => console.log("book deleted"))
          .catch(error => alert("could not delete book" + error));

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

  //  styles object for modal
  const modalStyles = {
    overlay: {
      position: "fixed",
      textAlign: "center",
      backgroundColor: "rgba(255, 255, 255, 0.75)",
    },
    content: {
      position: "absolute",
      border: "1px solid #ccc",
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      borderRadius: "5px",
      outline: "none",
      textAlign: "center",
      background: theme.background,
    },
  };

  function renderModal(modalIndex) {
    let modalTargetBook = bestsellersList[modalIndex];
    return (
      modalTargetBook && (
        <Modal
          theme={theme}
          style={modalStyles}
          isOpen={modal}
          modalIndex={modalIndex}
          onRequestClose={() => toggleModal()}
        >
          <img
            src={modalTargetBook.book_image}
            alt={modalTargetBook.title}
            width="250"
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

  function handleGoogleSignin() {
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
        alert(`Error: ${errorMessage}`);
        // console.log([errorCode, errorMessage, credential, email]);
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
          <h1>My Virtual Bookshelf</h1>
          <FaBookReader size={140}></FaBookReader>
          <StyledAbout>
            Do you love e-books and audiobooks but miss adding finished books to
            your bookshelf? Now you have a digital shelf to display your
            collection. Search books you've recently completed, add them to your
            virtual shelf and show your friends you've been reading!
            <br></br>
          </StyledAbout>
          <div>
            <h5>Create an Account or sign up with Google</h5>
            <StyledGoogleButton style={{ backgroundColor: "#00adb5" }}>
              <Link to="/signup">Sign up</Link>
            </StyledGoogleButton>
            <StyledGoogleButton
              name="googleSignIn"
              onClick={handleGoogleSignin}
            >
              {<FcGoogle size={25} />} Sign up with Google
            </StyledGoogleButton>
          </div>
        </>
      )}
      <div>
        <h3>What have you read lately?</h3>
        <h5 style={{ textDecoration: "underline" }}>NYT Best Sellers</h5>
        {!bestsellersList.length ? (
          <Loader
            type="ThreeDots"
            color="#00adb5"
            height={50}
            width={50}
            timeout={9000}
          />
        ) : (
          bestsellersList.map((book, index) => {
            return (
              <StyledBook key={uuidv4()}>
                <img src={book.book_image} alt={book.title}></img>
                <div>{book.title}</div>
                <div>{book.contributor}</div>
                <div>Rank: {book.rank}</div>
                <button onClick={() => toggleModal(index)}>
                  {<BiInfoSquare size={20} />}
                </button>
                {isLoggedIn && (
                  <button onClick={() => addOrRemoveFromList(book)}>
                    {homeList.some(
                      x => x.title === book.title && x.author === book.author
                    ) ? (
                      <AiOutlineDelete />
                    ) : (
                      "add to shelf"
                    )}
                  </button>
                )}
              </StyledBook>
            );
          })
        )}
      </div>
      {renderModal(modalIndex)}
      {!isLoggedIn && (
        <>
          <StyledAbout style={{ marginBottom: -15 }}>
            Create an account to add books to your shelf
          </StyledAbout>
          <StyledHomeButtons>
            <Link to="/signup">Sign up</Link>
          </StyledHomeButtons>
        </>
      )}
    </div>
  );
}

export default Home;
