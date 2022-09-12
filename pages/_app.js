import '../styles/globals.css';
import  {useAuthState} from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import UserProvider from '../providers/UserProvider';

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  if(loading){
    return <Loading />
  }
  if(!user){
    return <UserProvider><Login /></UserProvider>
  }
  return <Component {...pageProps} />
}

export default MyApp
