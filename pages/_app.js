import '../styles/globals.css';
import { useEffect } from 'react';
import  {useAuthState} from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import UserProvider from '../providers/UserProvider';
import { updateLastSeen } from '../lib/lastseen';

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if(!user) {return}
    /* Update the user's last seen status every 30s */
    const interval = setInterval(() => {
      console.log('updating status');
      updateLastSeen(user.uid)
    }, 30000); 
  
    return () => {
      console.log('unmounting...');
      clearInterval(interval);
    }
  }, [user])
  

  if(loading){
    return <Loading />
  }
  if(!user){
    return <UserProvider><Login /></UserProvider>
  }
  return <Component {...pageProps} />
}

export default MyApp
