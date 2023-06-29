import React, { useState } from "react";
import "./SearchHeader.css";
import { AutoComplete } from "antd";

const SearchHeader = ({ setSearchText, searchText }) => {
  const storedHistory = JSON.parse(
    localStorage.getItem("photoSearchHistory")
  )?.map((value) => ({
    value: value,
  }));

  const [options, setOptions] = useState(storedHistory ?? []);

  const onSearch = (text) => {
    const searchedHistory = JSON.parse(
      localStorage.getItem("photoSearchHistory")
    )?.map((value) => ({
      value: value,
    }));

    setOptions(
      searchedHistory?.filter((value) => {
        return value?.value?.includes(text);
      })
    );
  };

  return (
    <div className="Header">
      <p className="Title">Search Photos</p>
      <AutoComplete
        value={searchText}
        options={options}
        className="AutoComplete"
        onSearch={(text) => onSearch(text)}
        onChange={(text) => {
          setSearchText(text);
        }}
        placeholder="Search here..."
      />
    </div>
  );
};

export default SearchHeader;
