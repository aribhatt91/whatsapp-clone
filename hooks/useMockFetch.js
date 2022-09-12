import { useState, useEffect } from "react";

const useMockFetch = (file, options={}) => {
      const [data, setData] = useState(null);
      const [error, setError] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(async () => {
        setLoading(true);
        await new Promise(res => setTimeout(res, (options.delay || 2000), true))
        import('../lib/mock' + file)
            .then((res) => typeof res === 'string' ? res.json() : res)
            .then((data) => {
                if(!options.error){
                    setData(data)
                }else {
                    throw new Error('Error fetching data!');
                }
            })
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
      }, [file]);

      return {data, error, loading};
};

export default useMockFetch;