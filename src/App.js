import { useState, useRef, useEffect, useCallback } from "react";
import useSearch from "./useCharacterSearch";
function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { characters, hasMore, loading, error } = useSearch(query, pageNumber);
  const loader = useRef();

  const observeBtn = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore) {
            setPageNumber((prevPageNumber) => prevPageNumber + 1);
          }
        });
      },
      {
        rootMargin: "20px",
      }
    );
    observer.observe(loader.current);

    return observer;
  };

  useEffect(() => {
    const observer = observeBtn();

    return () => observer.unobserve(loader.current);
  }, [loader, pageNumber, loading]);

  // const observer = useRef();
  // const lastCharacterElement = useCallback(
  //   (node) => {
  //     if (loading) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver(
  //       (entries) => {
  //         if (entries[0].isIntersecting && hasMore) {
  //           setPageNUmber((prevPageNumber) => prevPageNumber + 1);
  //           console.log("I am in view");
  //         }
  //       },
  //       {
  //         rootMargin: "20px",
  //       }
  //     );
  //     if (node) observer.current.observe(node);
  //   },
  //   [loading, hasMore]
  // );

  function handleChange(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }
  return (
    <div className="container">
      <input type="text" value={query} onChange={handleChange}></input>
      {characters.map((character, index) => {
        return (
          <div className="avatar" key={index}>
            {character}
          </div>
        );

        // if (characters.length === index + 1) {
        //   return (
        //     <div ref={lastCharacterElement} className="avatar" key={index}>
        //       {/* <img src={character.image} alt="something" />
        //       <p>{character.name}</p> */}
        //       {character}
        //     </div>
        //   );
        // } else {
        //   return (
        //     <div className="avatar" key={index}>
        //       {/* <img src={character.image} alt="something" /> */}
        //       {/* <p>{character.name}</p> */}
        //       {character}
        //     </div>
        //   );
        // }
      })}
      <div ref={loader}>Load more</div>
      <div>{loading && "loading ..."}</div>
      <div>{error && "Error"}</div>
    </div>
  );
}

export default App;
