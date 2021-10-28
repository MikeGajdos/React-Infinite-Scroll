import { useEffect, useState } from "react";
import axios from "axios";

export default function useSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  useEffect(() => {
    setCharacters([]);
  }, [query]);
  useEffect(() => {
    setLoading(true);
    setError(false);
    const CancelToken = axios.CancelToken;
    let cancel;
    axios({
      method: "GET",
      url: `https://rickandmortyapi.com/api/character/`,
      params: {
        name: query,
        page: pageNumber,
      },
      cancelToken: new CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setCharacters((prevCharacters) => {
          return [
            ...new Set([
              ...prevCharacters,
              ...res.data.results.map((item) => {
                return {
                  name: item.name,
                  image: item.image,
                };
              }),
            ]),
          ];
        });
        setHasMore(pageNumber < res.data.info.pages);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber]);
  return { loading, error, characters, hasMore };
}
