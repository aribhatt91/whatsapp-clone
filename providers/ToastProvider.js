import React, {createContext, useContext, useReducer, useState} from "react";
import styled from "styled-components";
import {v4} from "uuid";
import Toast from "../components/Toast";

const ToastContext = createContext();

const ToastProvider = (props) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "ADD_TOAST":
        return [...state, {...action.payload}];
      case "REMOVE_TOAST":
        return state.filter(el => el.id !== action.id);
      default:
        return state
    }
  }, []);

  return(
    <ToastContext.Provider value={dispatch}>
      <ToastWrapper>
        {state.map((note) => {
          return <Toast dispatch={dispatch} key={note.id} {...note} />
        })}
      </ToastWrapper>
      {props.children}
    </ToastContext.Provider>
  )
};

export const useToast = () => {
  const dispatch = useContext(ToastContext);

  return (props) => {
    //window.loginfo('useToast called');
    dispatch({
      type: "ADD_TOAST",
      payload: {
        id: v4(),
        ...props
      }
    })
  }
};

const ToastWrapper = styled.div``;

export default ToastProvider;