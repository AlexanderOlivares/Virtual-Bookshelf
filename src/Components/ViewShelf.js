import React from "react";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import { StyledBook, StyledContainer } from "./Search";
import Modal from "react-modal";
import { Link, useParams } from "react-router-dom";
import { GiBookshelf } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { BiInfoSquare } from "react-icons/bi";
import { modalStyles } from "./GlobalStyle";
import Loader from "react-loader-spinner";

function ViewShlef({ theme }) {
  modalStyles.content.background = theme.background;
  const [loadingBooks, setLoadingBooks] = useState(true);

  const [list, setList] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(-1);
  const [sharedUser, setSharedUser] = useState([]);

  const uid = useParams();
  let shared_UID = Object.values(uid)[0];

  // load previously saved books from db
  useEffect(() => {
    db.collection(`users/${shared_UID}/shelf`).onSnapshot(snapshot => {
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
    db.collection(`users/`).onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.uid === shared_UID) {
          let sharedName = data.username;
          sharedName = String(sharedName).endsWith("s")
            ? `${sharedName}'`
            : `${sharedName}'s`;
          setSharedUser(sharedName);
        }
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

  return (
    <>
      <h1>{sharedUser} Shelf</h1>
      <div style={{ margin: "0 auto", padding: 30 }}>
        <GiBookshelf size={170} />
      </div>
      {loadingBooks ? (
        <Loader type="ThreeDots" color="#00adb5" height={50} width={50} />
      ) : (
        <StyledContainer>
          {!list.length ? (
            <>
              <div style={{ margin: "0 auto", paddingTop: 40 }}>
                <h4>{"sharer's"} shelf is empty.</h4>
                <button style={{ margin: 30 }}>
                  <Link to="/search">Search</Link>
                </button>
              </div>
              <br></br>
            </>
          ) : (
            list.map((currentBook, index) => {
              return (
                <StyledBook key={uuidv4()}>
                  <img
                    src={currentBook.thumbnail_URL}
                    alt={currentBook.title}
                    width="128"
                    height="195"
                  ></img>
                  <br></br>
                  <button onClick={() => toggleBookModal(index)}>
                    {<BiInfoSquare />}
                  </button>
                </StyledBook>
              );
            })
          )}
        </StyledContainer>
      )}
      <div>{renderBookModal(modalIndex)}</div>
    </>
  );
}

export default ViewShlef;
