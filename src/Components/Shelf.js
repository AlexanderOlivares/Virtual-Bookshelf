import React from "react";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import { StyledBook, StyledContainer } from "./Search";
import { StyledSignup, StyledInput, StyledButton } from "./Signup";
import { modalStyles } from "./GlobalStyle";
import Modal from "react-modal";
import emailjs from "emailjs-com";
import { Link } from "react-router-dom";
import { GiBookshelf } from "react-icons/gi";
import { StyledActiveUser } from "./Home";
import { FiUserCheck } from "react-icons/fi";
import { AiOutlineDelete, AiOutlineClose } from "react-icons/ai";
import { BiInfoSquare } from "react-icons/bi";
import Loader from "react-loader-spinner";

function Shelf({ user_UID, isLoggedIn, username, theme }) {
  const EMAILJS_USERID = process.env.REACT_APP_EMAILJS_USERID;
  const EMAILJS_SERVICEID = process.env.REACT_APP_EMAILJS_SERVICEID;
  const EMAILJS_TEMPLATEID = process.env.REACT_APP_EMAILJS_TEMPLATEID;

  modalStyles.content.background = theme.background;

  // still need to test this more and check it in
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [list, setList] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(-1);
  const [emailModal, setEmailModal] = useState(false);
  let isLoggedInAndList = isLoggedIn && list.length ? true : false;

  // load previously saved books from db
  useEffect(() => {
    db.collection(`users/${user_UID}/shelf`).onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        setList(prev => [
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
    if (loadingBooks) {
      setTimeout(() => {
        setLoadingBooks(false);
      }, 1000);
    }
  }, [loadingBooks]);

  function renderBookModal(modalIndex) {
    let modalTargetBook = list[modalIndex];
    return (
      modalTargetBook && (
        <Modal
          theme={theme}
          style={modalStyles}
          isOpen={modal}
          onRequestClose={() => toggleBookModal()}
        >
          <button
            style={{ position: "absolute", top: 5, left: 5, border: "none" }}
            onClick={() => toggleBookModal()}
          >
            <AiOutlineClose size={20} />
          </button>
          <img
            width="128"
            src={modalTargetBook.thumbnail_URL}
            alt={modalTargetBook.title}
          ></img>
          <p>{modalTargetBook.description}</p>
          <p>{`by ${modalTargetBook.author}`}</p>
          <div>
            <button onClick={() => toggleBookModal()}>close</button>
          </div>
        </Modal>
      )
    );
  }

  function toggleBookModal(index = -1) {
    setModalIndex(index);
    setModal(prev => !prev);
  }

  function removeFromList(e) {
    const deleteConfirmed = window.confirm(
      `Are you sure you want to delete ${e.title} from your shelf?`
    );

    if (deleteConfirmed) {
      setLoadingBooks(true);

      const book_ID = db
        .collection("users")
        .doc(`${user_UID}`)
        .collection(`shelf`)
        .doc(`${e.title}`);

      book_ID.get().then(docSnapshot => {
        if (docSnapshot.exists) {
          book_ID
            .delete()
            .then(() => console.log("book deleted"))
            .catch(error => console.error("could not delete book" + error));

          setList(list.filter(book => book.title === book_ID));
        }
      });
    }
  }

  function sendEmail(e) {
    e.preventDefault();

    emailjs
      .sendForm(EMAILJS_SERVICEID, EMAILJS_TEMPLATEID, e.target, EMAILJS_USERID)
      .then(
        result => {
          alert("Success! Your email has been sent. Thanks for sharing");
          console.log(result.text);
        },
        error => {
          alert(
            error +
              "Could not send email. Double check the email address and try again."
          );
          console.log(error.text);
        }
      );

    setEmailModal(false);
    e.target.reset();
  }

  function renderEmailModal() {
    return (
      <Modal
        theme={theme}
        isOpen={emailModal}
        onRequestClose={() => setEmailModal(false)}
        style={modalStyles}
      >
        <>
          <StyledSignup className="contact-form" onSubmit={sendEmail}>
            <h4>Share your bookshelf</h4>
            <p> email this shelf to:</p>
            <input
              type="hidden"
              name="username"
              value={
                String(username).endsWith("s")
                  ? `${username}'`
                  : `${username}'s`
              }
            />
            <input type="hidden" name="usernameSingular" value={username} />
            <input type="hidden" name="user_UID" value={user_UID} />
            <input
              type="hidden"
              name="link"
              value={`https://alexanderolivares.github.io/Virtual-Bookshelf/#/ViewShelf/${user_UID}`}
            />
            <StyledInput
              type="email"
              name="email"
              placeholder="name@email.com"
              required
            />
            <StyledButton type="submit">share shelf</StyledButton>
            <div>
              <button
                style={{ marginTop: 15, borderRadius: 5 }}
                onClick={() => setEmailModal(false)}
              >
                close
              </button>
            </div>
          </StyledSignup>
        </>
      </Modal>
    );
  }

  return (
    <>
      {isLoggedIn && (
        <div>
          <FiUserCheck />
          <StyledActiveUser>{`${username}`}</StyledActiveUser>
        </div>
      )}
      <h1>My Shelf</h1>
      <div style={{ margin: "0 auto", padding: 30 }}>
        <GiBookshelf size={170} />
      </div>
      <div>
        {isLoggedInAndList && (
          <button onClick={() => setEmailModal(true)}>email shelf</button>
        )}
      </div>
      {loadingBooks ? (
        <Loader
          type="ThreeDots"
          color="#00adb5"
          height={50}
          width={50}
          timeout={9000}
        />
      ) : (
        <StyledContainer>
          {!list.length && !loadingBooks ? (
            <>
              <div style={{ margin: "0 auto", paddingTop: 40 }}>
                <h4>
                  Your shelf is empty. Search for books to add to your shelf
                </h4>
                <button style={{ margin: 30 }}>
                  <Link to="/search">Search</Link>
                </button>
              </div>
              <br></br>
            </>
          ) : (
            list.map((e, index) => {
              return (
                <StyledBook key={uuidv4()}>
                  <img
                    src={e.thumbnail_URL}
                    alt={e.title}
                    width="128"
                    height="195"
                  ></img>
                  <br></br>
                  <button onClick={() => toggleBookModal(index)}>
                    {<BiInfoSquare />}
                  </button>
                  {isLoggedIn && (
                    <button onClick={() => removeFromList(e)}>
                      {<AiOutlineDelete />}
                    </button>
                  )}
                </StyledBook>
              );
            })
          )}
        </StyledContainer>
      )}
      <div>{renderEmailModal()}</div>
      <div>{renderBookModal(modalIndex)}</div>
    </>
  );
}

export default Shelf;
