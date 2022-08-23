import styled from "styled-components"

function Loading() {
  return (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        zIndex: 9999,
        backgroundColor: '#128c7e',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <img style={{
            height: '100px',
            width: 'auto',
            margin: '40px'
        }} src="https://static.whatsapp.net/rsrc.php/ym/r/36B424nhiL4.svg" />
    </div>
  )
}
export default Loading;