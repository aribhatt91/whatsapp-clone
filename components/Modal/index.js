import React from 'react';
import styled from "styled-components";

function Modal({onClose, width, padding, children}) {
  return (
    <ModalWrapper>
        <ModalContent width={width}>
            <ModalBody>
                {children}
            </ModalBody>
            <ModalCloseIcon onClick={onClose}>
                &times;
            </ModalCloseIcon>
        </ModalContent>
    </ModalWrapper>
  )
}

const ModalWrapper = styled.div`
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: fixed;
    background-color: rgba(0,0,0,0.75);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div.attrs((props) => {
    width: props.width ? props.width : '600px'
})`
    max-width: 90%;
    background-color: #fff;
    border-radius: 2px;
    position: relative;
`;

const ModalBody = styled.div``;

const ModalCloseIcon = styled.span`
    width: 1.5rem;
    height: 1.5rem;
    font-size: 2rem;
    line-height: 1;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    cursor: pointer;
`;

export default Modal