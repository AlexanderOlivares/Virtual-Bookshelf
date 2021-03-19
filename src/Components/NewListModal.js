import React, { useState } from "react";
import Search from "./Search";

function NewListModal({
  user_UID,
  setFocusedShelf,
  isShelfPrivate,
  setIsShelfPrivate,
}) {
  const [shelfNameInput, setShelfNameInput] = useState("");
  const [closeModal, setCloseModal] = useState(false);

  function handleChange(e) {
    setShelfNameInput(e.currentTarget.value);
  }

  function handlePrivateShelf() {
    setIsShelfPrivate(prev => !prev);
  }

  // will need to change the route if you update db schema
  function handleSubmit(e) {
    e.preventDefault();
    let newBooklistID = `bookist_${user_UID}_${shelfNameInput}`;
    if (isShelfPrivate) {
      setFocusedShelf(`private_${newBooklistID}`);
    } else {
      setFocusedShelf(newBooklistID);
    }
    document.getElementById("newListForm").style.display = "none";
  }

  return (
    <div id="newListForm">
      <form onSubmit={handleSubmit}>
        <h4>New Shelf</h4>
        <p>{shelfNameInput}</p>
        <input
          onChange={handleChange}
          type="text"
          placeholder="Name your New Shelf"
        ></input>
        <div>
          <p>Make this shelf private?</p>
          <input
            id="privateShelf"
            type="checkbox"
            onClick={handlePrivateShelf}
          ></input>
          <label htmlFor="privateShelf">Yes</label>
        </div>
        <button>Cancel</button>
        <button type="submit">Create Shelf</button>
      </form>
    </div>
  );
}

export default NewListModal;
