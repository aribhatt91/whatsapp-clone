import { useState, useEffect } from "react"
import { db } from "../firebase";
import { collection, query, where, orderBy, startAt, limit, getDocs } from "firebase/firestore";

const useGetFirestoreDb = (dbName, options={}) => {
    const [ data, setData ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const { comparisons=[], sort=null, perPageLimit, page=1 } = options;

    let lastVisible = null;

    useEffect(() => {

        (async () => {
            try{
                let result = [];
                const ref = collection(db, dbName);

                

                const params = [];

                comparisons.map(comparison => params.push(where(comparison.key, comparison.comparator || '==', comparison.value)));

                if(sort) {
                    params.push(orderBy(sort.by, sort.desc ? 'DESC' : 'ASC'));
                }

                if(perPageLimit){
                    params.push(limit(perPageLimit))
                }
                
                let q = query(ref, ...params);

                const docs = await getDocs(q);

                docs.forEach(doc => result.push(doc.data()));

                setData(result);
    
            }catch(error){
                console.error(error);
                setError(error);
            }finally {
                setLoading(false);
            }
        })()
        
        
    }, [dbName, page]);

    return { data, loading, error, lastVisible };
}

export default useGetFirestoreDb;