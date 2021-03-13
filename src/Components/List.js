import React from "react";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import { StyledBook, StyledContainer } from "./Search";

function List({ user_UID }) {
  const [list, setList] = useState([]);

  // chnge to only get items that match the signed in username id
  useEffect(() => {
    db.collection(`users/${user_UID}/booklist_${user_UID}`).onSnapshot(
      snapshot => {
        snapshot.forEach(doc => {
          const data = doc.data();
          setList(prev => [
            ...prev,
            {
              title: data.title,
              thumbnail_URL: data.thumbnail,
            },
          ]);
        });
      }
    );
  }, []);

  console.log(list);

  return (
    <>
      <div>
        <h1>My Book List</h1>
      </div>
      <StyledContainer>
        {!list.length
          ? "loading..."
          : list.map((e, i) => {
              return (
                <StyledBook key={uuidv4()}>
                  <img src={e.thumbnail_URL} alt={e.title}></img>
                </StyledBook>
              );
            })}
      </StyledContainer>
    </>
  );
}

export default List;

// useEffect(() => {
//   db.collection(`users/${user_UID}/booklist`)
//     .get()
//     .then(quereySnapshot => {
//       quereySnapshot.forEach(doc => {
//         setList(prev =>
//           Array.from(
//             new Set(
//               [...prev, String(Object.values(doc.data())).split(",")].flat()
//             )
//           )
//         );
//       });
//     });
// }, []);
