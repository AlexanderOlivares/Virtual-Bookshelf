import React from "react";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import { StyledBook, StyledContainer } from "./Search";
import Modal from "react-modal";

function Shlef({ user_UID }) {
  const [list, setList] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(-1);

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

  console.log(list);

  return (
    <>
      <div>
        <h1>My Book List</h1>
        <button>Share this shelf</button>
      </div>
      <StyledContainer>
        {!list.length
          ? "loading..."
          : list.map((e, index) => {
              return (
                <StyledBook key={uuidv4()}>
                  <img src={e.thumbnail_URL} alt={e.title}></img>
                  <br></br>
                  <button onClick={() => toggleModal(index)}>info</button>
                  <button onClick={() => removeFromList(e)}>
                    remove from list
                  </button>
                </StyledBook>
              );
            })}
      </StyledContainer>
      <div>{renderModal(modalIndex)}</div>
    </>
  );
}

export default Shlef;
