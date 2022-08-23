import { db, FieldValue } from "../firebase";
import { doc, addDoc, getDoc, setDoc, query, where, collection } from "firebase/firestore";


const userCollection = collection(db, 'users');
const chatCollection = collection(db, 'chats');

export const getUser = async (email) => {
    try{
        const q = query(userCollection, where("email", '==', email));
        const docs = await getDoc(query);
        const user = null;
        if(docs.length > 0){
            user = docs[0].data();
        }else {
            throw new Error('Unique user not found');
        }
        return new Promise(resolve => resolve(user));
    }catch(error){
        console.error('Firestore::functions::getUser::error', error);
        return new Promise((resolve, reject) => reject(error));
    }
}

export const updateUser = async (user) => {
    try{
        console.log('User Logged In:', user);
        const res = await setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            photoURL: user.photoURL,
            name: user.displayName,
            lastSeen: (new Date()).toUTCString()
        }, {merge: true});
        return new Promise(resolve => resolve(res));
    }catch(error){
        console.error('Firestore::functions::updateUser::error', error);
        return new Promise((resolve, reject) => reject(error));
    }
}

export const getAllUsers = async () => {}

export const getUserChat = async (user) => {}