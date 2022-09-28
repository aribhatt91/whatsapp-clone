import { useState, useEffect, useMemo } from "react";

const useFetch = (url, options={}) => {
      const [data, setData] = useState(null);
      const [error, setError] = useState(null);

      const abortController = useMemo(() => new AbortController(), []);
      const loading = data === null && error === null;

      useEffect(() => {

        const fetchData = async () => {

          try {
            const res = await fetch(url, {...options, signal: abortController.signal});
            const json = await res.json();
            setData(json);

          }catch(error) {
            setError(error);
          }

        }

        fetchData();

        return () => {
          if(typeof abortController.abort === 'function'){
            abortController.abort()
          }
        };

      }, []);

      return { data, error, loading, abort: abortController.abort };
};

export default useFetch;