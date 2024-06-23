import { useState, useCallback } from "react";

const useDebouncedSearch = (fetchData, delay = 500) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleSearch = async (query) => {
    const res = await fetchData(`/search/${query}`);
    setSearchResults(res);
    res && res.length > 0 && setIsFocused(true);
  };

  const debouncedSearch = useCallback(debounce(handleSearch, delay), []);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  return {
    searchTerm,
    searchResults,
    isFocused,
    setIsFocused,
    handleChange,
    handleInputBlur,
  };
};

export default useDebouncedSearch;
