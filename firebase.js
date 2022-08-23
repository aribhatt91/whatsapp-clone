import {initializeApp, getApp} from "firebase/app";
import {getAuth, signInWithPopup, signOut, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore, collection, FieldValue} from 'firebase/firestore';
import config from './keys/firebase-config.json';

function createFirebaseApp(config) {
    try {
      return getApp();
    } catch {
      return initializeApp(config);
    }
}
const app = createFirebaseApp(config);
//firebase.initializeApp(config) ;


const auth = getAuth(app);
const db = getFirestore();

const provider = new GoogleAuthProvider();

export {db, auth, signOut, signInWithPopup, FieldValue, provider};