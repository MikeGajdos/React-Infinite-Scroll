import { useState, useRef, useCallback } from "react";
import useSearch from "./useCharacterSearch";
function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNUmber] = useState(1);
  const { characters, hasMore, loading, error } = useSearch(query, pageNumber);

  const observer = useRef();
  const lastCharacterElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPageNUmber((prevPageNumber) => prevPageNumber + 1);
          }
        },
        {
          rootMargin: "20px",
        }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleChange(e) {
    setQuery(e.target.value);
    setPageNUmber(1);
  }
  return (
    <div className="container">
      <input type="text" value={query} onChange={handleChange}></input>
      {characters.map((character, index) => {
        if (characters.length === index + 1) {
          return (
            <div ref={lastCharacterElement} className="avatar" key={index}>
              <img src={character.image} alt="something" />
              <p>{character.name}</p>
            </div>
          );
        } else {
          return (
            <div className="avatar" key={index}>
              <img src={character.image} alt="something" />
              <p>{character.name}</p>
            </div>
          );
        }
      })}
      <div>{loading && "loading ..."}</div>
      <div>{error && "Error"}</div>
    </div>
  );
}

export default App;
