import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StyledBook, StyledContainer } from "./Search";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firebase";
import Modal from "react-modal";
Modal.setAppElement("#root");

function Home({ isLoggedIn, username, user_UID }) {
  const NYT_API_KEY = process.env.REACT_APP_NYT_BESTSELLERS_API_KEY;

  const [bestsellersList, setBestsellersList] = useState([]);
  const [homeList, setHomeList] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

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
        // console.log(res.results.books);
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

  function toggleModal() {
    setModal(!modal);
  }

  console.log(modalIndex);

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <p>{`${username}`}</p>
          <button>go to my shelf</button>
          <button>search all books</button>
        </div>
      ) : (
        <>
          <h1>My Virtual Bookshelf</h1>
          <p>
            Always read E-books? Only listen audiooks? Now you have a place to
            display your collection. Create a virtual Bookshelf and show your
            friends what you're reading
          </p>
          <div>
            <hr></hr>
            <h5>Create an Account or sign up with Google</h5>
            <button>
              <Link to="/signup">Sign up now!</Link>
            </button>
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
                  <button onClick={toggleModal}>info</button>
                  {isLoggedIn && (
                    <button onClick={() => addOrRemoveFromList}>
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

      {/* STARTING FRESH WITH MODAL. NEED TO PREVENT RE-RENDER LOOP */}
      <Modal isOpen={modal} onRequestClose={() => setModal(false)}>
        <div>
          <button onClick={() => setModal(false)}>close</button>
        </div>
      </Modal>
    </div>
  );
}

export default Home;

// <Modal isOpen={modal} index{modalIndex} onRequestClose={activeItem(-1)}>
//   <div>
//     <p>{bestsellersList[modalIndex].title}</p>
//     <img
//       src={bestsellersList[modalIndex].book_image}
//       alt={bestsellersList[modalIndex].title}
//     ></img> */}
//   </div>
//   <div>
//     <button onClick={() => setModal(false)}>close</button>
//   </div>
// </Modal>
