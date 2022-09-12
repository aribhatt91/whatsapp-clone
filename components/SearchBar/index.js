import styled from "styled-components";
import { Search } from "@material-ui/icons";
import { debounce } from "lodash";
import {useState} from 'react';

function SearchBar({onSearch, typeAhead=true}) {
  const [searchTerm, setSearchTerm] = useState('');

  const optimisedSearch = typeAhead && onSearch ? debounce((e) => onSearch(e.target.value), 200) : debounce((e) => setSearchTerm( prev => e.target.value), 200);

  return (
    <SearchContainer>
      <Search />
      <SearchInput placeholder="Search.." onChange={optimisedSearch} />
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

const SearchInput = styled.input.attrs(props => {
  type: props.type || 'text'
})`
  background-color: transparent;
  outline-width: 0;
  border: none;
  padding: 4px 8px;
  flex: 1;
  outline: none !important;
`;