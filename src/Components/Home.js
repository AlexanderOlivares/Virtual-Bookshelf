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
import { modalStyles } from "./GlobalStyle";
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

function Home({ isLoggedIn, setIsLoggedIn, username, user_UID, theme }) {
  const NYT_API_KEY = process.env.REACT_APP_NYT_BESTSELLERS_API_KEY;
  modalStyles.content.background = theme.background;

  const [bestsellersList, setBestsellersList] = useState([]);
  const [homeList, setHomeList] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(-1);

  // to check if any NYT bestsellers are already saved to shelf
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

        setHomeList(homeList.filter(item => item.title !== book.title));
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
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(`Error could not sign in. Please Try again.`);
        console.warn(`${errorCode}. ${errorMessage}`);
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
            Miss the feeling of putting hardcovers and paperbacks on your
            bookshelf? If you listen to audiobooks or read e-books now you can
            visualize your collection with Virtual Bookshelf. Create an account,
            search for books to add to your shelf and show your friends what
            you've been reading!
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
                <img
                  style={{ maxWidth: "100%" }}
                  src={book.book_image}
                  alt={book.title}
                ></img>
                <div>{book.title}</div>
                <div>{book.contributor}</div>
                <div>Rank: {book.rank}</div>
                <button onClick={() => toggleModal(index)}>
                  {<BiInfoSquare size={16} />}
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
