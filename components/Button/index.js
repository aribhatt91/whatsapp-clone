import React from 'react'
import styled from 'styled-components'

function Button({size, width, onClick, children}) {
  return (
    <AppButton onClick={onClick}>{children}</AppButton>
  )
}

const AppButton = styled.button.attrs(props => {

})`
    min-height: 48px;
    outline: none;
    width: 100%;
    border: none;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #128c7e;
    border-radius: 48px;
    font-size: 1rem;
    cursor: pointer;

`

export default Button