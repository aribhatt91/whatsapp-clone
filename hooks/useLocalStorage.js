import {useState, useEffect} from 'react';

export default function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(initialValue);
    useEffect(() => {
        const v = window.localStorage.getItem(key) || initialValue;
        setValue(v);
    }, [key])

    const setItem = (v) => {
        window.localStorage.setItem(key, v);
        setValue(v);
    }

    return [value, setItem];
}