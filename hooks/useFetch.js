import { useState, useEffect } from "react";

const useFetch = (url, options={}) => {
      const [data, setData] = useState(null);
      const [error, setError] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        setLoading(true);
        fetch(url)
          .then((res) => typeof res === 'string' ? res.json() : res)
          .then((data) => setData(data))
          .catch((err) => setError(err))
          .finally(() => setLoading(false));
      }, [url]);

      return {data, error, loading};
};

export default useFetch;