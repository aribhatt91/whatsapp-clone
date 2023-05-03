import { db } from "../firebase";
import { doc, addDoc, limit, updateDoc, getDocs, getDoc, setDoc, query, where, collection, orderBy, startAfter } from "firebase/firestore";

const DB_SWITCHED_OFF = false;

export const readDocs = async (tableName, options) => {

    if(DB_SWITCHED_OFF) {
        return Promise.resolve({});
    }

    let { comparisons=[], sort=null, perPageLimit, lastIndex=null } = options;
    
    try{
        let data = [];
        const ref = collection(db, tableName);

        const params = [];

        comparisons.map(comparison => params.push(where(comparison.key, comparison.comparator || '==', comparison.value)));

        if(sort) {
            params.push(orderBy(sort.by, sort.desc ? 'desc' : 'asc'));
        }
        
        if(lastIndex && perPageLimit){
            params.push(startAfter(lastIndex))
        }

        if(perPageLimit){
            params.push(limit(perPageLimit))
        }
        
        let q = query(ref, ...params);

        const documentSnapshots = await getDocs(q);
        lastIndex = documentSnapshots.docs[documentSnapshots.docs.length-1];

        documentSnapshots.forEach(docSnap => data.push(docSnap.data()));
        
        return new Promise((resolve) => resolve({data, lastIndex}))
    }catch(error){
        console.error(error);
        return new Promise((resolve, reject) => reject(error));
    }
}

export const readDoc = async (tableName, docId) => {

    if(DB_SWITCHED_OFF) {
        return Promise.resolve({});
    }

    try{
        const ref = doc(db, tableName, docId);
        
        const docSnap = await getDoc(ref);

        if(docSnap.exists()){
            return new Promise((resolve) => resolve(docSnap.data()))
        }else {
            throw new Error('No document found in the collection!')
        }
    }catch(error){
        return new Promise((resolve, reject) => reject(error));
    }
}

export const writeDoc = async (tableName, docId, update) => {

    if(DB_SWITCHED_OFF) {
        return;
    }

    try{
        const ref = collection(db, tableName)
        if(docId === null) {
            addDoc(ref, update)
            .then(res => console.log(`Added ${tableName} record successfully`, res))
            .catch(error => console.error(`dbHelper::functions::addDoc::${tableName}::error`, error));
        }else {
            setDoc(doc(ref, docId), update, { merge: true })
            .then(res => console.log(`Set ${tableName} record: ${docId} successfully`, res))
            .catch(error => console.error(`dbHelper::functions::setDoc::${tableName}::error`, error));
        }
    }catch(error){
        console.error(`dbHelper::functions::writeDoc::${tableName}::error`, error);
    }
}

export const updateDocById = async (tableName, docId, update) => {

    if(DB_SWITCHED_OFF) {
        return;
    }
    
    try{
        updateDoc(doc(db, tableName, docId), update)
        .then(res => console.log(`Updated ${tableName} record: ${docId} successfully`, res))
        .catch(error => {
            console.error(`dbHelper::functions::updateDocById::${tableName}::error`, error);
            console.log('Trying writeDoc');
            writeDoc(tableName, docId, update);
        });
    }catch(error){
        console.error(`dbHelper::functions::writeDoc::${tableName}::error`, error);
    }
}

export const removeDoc = async (tableName, docId) => {}

/* export default {
    readDoc, readDocs, writeDoc, updateDocById, removeDoc
} */