import styled from "styled-components";
import { Search } from "@material-ui/icons";

function SearchBar() {
  return (
    <SearchContainer>
      <Search/>
      <SearchInput placeholder="Search.." />
    </SearchContainer>
  )
}

export default SearchBar;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #fff;
  border-radius: 48px;
  height: 48px;
`;

const SearchInput = styled.input`
  background-color: transparent;
  outline-width: 0;
  border: none;
  padding: 4px 8px;
  flex: 1;
`;