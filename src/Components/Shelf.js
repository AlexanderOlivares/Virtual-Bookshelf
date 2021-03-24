import React from "react";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import { StyledBook, StyledContainer } from "./Search";
import Modal from "react-modal";
import emailjs from "emailjs-com";

function Shlef({ user_UID, isLoggedIn, username }) {
  const EMAILJS_USERID = process.env.REACT_APP_EMAILJS_USERID;
  const EMAILJS_SERVICEID = process.env.REACT_APP_EMAILJS_SERVICEID;
  const EMAILJS_TEMPLATEID = process.env.REACT_APP_EMAILJS_TEMPLATEID;

  const [list, setList] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(-1);
  const [emailModal, setEmailModal] = useState(false);

  // chnge to only get items that match the signed in username id
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
    console.log("useEffect ran");
  }, []);

  function renderModal(modalIndex) {
    let modalTargetBook = list[modalIndex];
    return (
      modalTargetBook && (
        <Modal
          isOpen={modal}
          modalIndex={modalIndex}
          onRequestClose={() => toggleModal()}
        >
          <img
            src={modalTargetBook.thumbnail_URL}
            alt={modalTargetBook.title}
          ></img>
          <p>{modalTargetBook.description}</p>
          <p>{`by ${modalTargetBook.author}`}</p>
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

  function removeFromList(e) {
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

  function sendEmail(e) {
    e.preventDefault();

    emailjs
      .sendForm(EMAILJS_SERVICEID, EMAILJS_TEMPLATEID, e.target, EMAILJS_USERID)
      .then(
        result => {
          console.log(result.text);
        },
        error => {
          console.log(error.text);
        }
      );

    setEmailModal(false);
    e.target.reset();
  }

  function renderEmailModal() {
    return (
      <Modal isOpen={emailModal} onRequestClose={() => setEmailModal(false)}>
        <>
          <p> email this bookshelf to:</p>
          <form className="contact-form" onSubmit={sendEmail}>
            <input type="hidden" name="username" value={username} />
            <input type="hidden" name="link" value={window.location.href} />
            <input type="email" name="email" />
            <button type="submit">share shelf</button>
          </form>
          <div>
            <button onClick={() => setEmailModal(false)}>close</button>
          </div>
        </>
      </Modal>
    );
  }

  return (
    <>
      <div>
        <h1>My Book List</h1>
        {isLoggedIn && (
          <button onClick={() => setEmailModal(true)}>email shelf</button>
        )}
      </div>
      <StyledContainer>
        {!list.length
          ? // FIX THIS LOADING WHEN ERROR HANDLING
            "loading..."
          : list.map((e, index) => {
              return (
                <StyledBook key={uuidv4()}>
                  <img src={e.thumbnail_URL} alt={e.title}></img>
                  <br></br>
                  <button onClick={() => toggleModal(index)}>info</button>
                  {isLoggedIn && (
                    <button onClick={() => removeFromList(e)}>
                      remove from list
                    </button>
                  )}
                </StyledBook>
              );
            })}
      </StyledContainer>
      <div>{renderEmailModal()}</div>
      <div>{renderModal(modalIndex)}</div>
    </>
  );
}

export default Shlef;
