import React, { useState, useEffect, useContext } from 'react';
import { auth, signInWithPopup, signOut, provider } from "../firebase";
import  {useAuthState} from 'react-firebase-hooks/auth';
import { updateUser } from '../lib/users';

const UserContext = React.createContext();

export const useUserContext = () => {
  return useContext(UserContext);
}

export default function UserProvider({children}) {
  const [user, loading] = useAuthState(auth);

  const signIn = () => {
    signInWithPopup(auth, provider).catch(console.error);
  }

  useEffect(() => {
    if(user){
      (async () =>{
        try {
          await updateUser(user);
        } catch (error) {
          console.error("MyApp::useEffect::updateUser::error", error);
        }
      })()
    }
  }, [user]);

  const value = {
    user,
    signIn,
    signOut,
    loginInProgress: loading
  }

  return (
    <UserContext.Provider value={value}>
      {
        children
      }
    </UserContext.Provider>
  )
}