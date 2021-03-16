import React, { useState } from "react";

function NewListModal({
  user_UID,
  setFocusedShelf,
  isShelfPrivate,
  setIsShelfPrivate,
}) {
  const [shelfNameInput, setShelfNameInput] = useState("");

  function handleChange(e) {
    setShelfNameInput(e.currentTarget.value);
  }

  function handlePrivateShelf() {
    setIsShelfPrivate(prev => !prev);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let newBooklistID = `bookist_${user_UID}_${shelfNameInput}`;
    if (isShelfPrivate) {
      setFocusedShelf(`private_${newBooklistID}`);
    } else {
      setFocusedShelf(newBooklistID);
    }
  }

  return (
    <div>
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
          <label for="privateShelf">Yes</label>
        </div>
        <button>Cancel</button>
        <button type="submit">Create Shelf</button>
      </form>
    </div>
  );
}

export default NewListModal;
