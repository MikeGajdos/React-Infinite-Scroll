import { useState, useRef, useCallback } from "react";
import useSearch from "./useBookSearch";
function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNUmber] = useState(1);
  const { characters, hasMore, loading, error } = useSearch(query, pageNumber);

  const observer = useRef();
  const lastCharacterElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNUmber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleChange(e) {
    setQuery(e.target.value);
    setPageNUmber(1);
  }
  return (
    <>
      <input type="text" value={query} onChange={handleChange}></input>
      {characters.map((character, index) => {
        if (characters.length === index + 1) {
          return (
            <div ref={lastCharacterElement} className="avatar" key={character}>
              {character}
            </div>
          );
        } else {
          return (
            <div className="avatar" key={character}>
              {character}
            </div>
          );
        }
      })}
      <div>{loading && "loading ..."}</div>
      <div>{error && "Error"}</div>
    </>
  );
}

export default App;
