import '../styles/globals.css';
import  {useAuthState} from 'react-firebase-hooks/auth';
import {db, auth, FieldValue } from '../firebase';
import Login from './login';
import { useEffect } from 'react';
import Loading from '../components/Loading';
import { updateUser } from '../lib/firestore';

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  if(loading){
    return <Loading />
  }
  if(!user){
    return <Login />
  }
  return <Component {...pageProps} />
}

export default MyApp
