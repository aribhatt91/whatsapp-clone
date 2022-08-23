import styled from "styled-components";

const UserListItem = () => {
    return (
        <Container>
            <Avatar></Avatar>
            <TextContainer>
                <p></p>
            </TextContainer>
        </Container>
    );
}

export default UserListItem;

const Container = styled.div`
    display: flex;
    padding: 8px 16px;
    align-items: center;
`
const Avatar = styled.img`
    width: 56px;
    height: 56px;
`