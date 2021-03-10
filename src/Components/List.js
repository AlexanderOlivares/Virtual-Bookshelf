import React from "react";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";

function List({ username, isloggedIn }) {
  const [list, setList] = useState([]);

  // chnge to only get items that match the signed in username id
  useEffect(() => {
    db.collection("test")
      .get()
      .then(quereySnapshot => {
        quereySnapshot.forEach(doc => {
          setList(prev =>
            Array.from(
              new Set(
                [...prev, String(Object.values(doc.data())).split(",")].flat()
              )
            )
          );
        });
      });
  }, []);

  return (
    <>
      <div>
        <h1>My Book List</h1>
      </div>
      {!list.length
        ? "loading..."
        : list.map((e, i) => {
            return <div key={uuidv4()}>{e}</div>;
          })}
    </>
  );
}

export default List;
