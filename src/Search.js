import React from "react";
import { useState } from "react";

function Search() {
  const [searchInput, setSearchInput] = useState("");

  function handleChange(e) {
    setSearchInput(e.target.value);
    console.log(searchInput);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // fetch google api here
  }

  return (
    <div>
      <h1>Search Books</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="book title" onChange={handleChange}></input>
      </form>
    </div>
  );
}

export default Search;
