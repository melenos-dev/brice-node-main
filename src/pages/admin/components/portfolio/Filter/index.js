import React, { useState, useEffect } from "react";

export default function Filter({
  id,
  name,
  selectedFilters,
  setSelectedFilters,
}) {
  const getFilterIndex = (id) => {
    return selectedFilters.findIndex((current) => current.id === id);
  };

  const handleClick = (e, id) => {
    e.preventDefault();
    const filterIndex = getFilterIndex(id);

    filterIndex !== -1
      ? (selectedFilters.splice(filterIndex, 1),
        setSelectedFilters([...selectedFilters]))
      : setSelectedFilters([...selectedFilters, { id: id }]);
  };

  return (
    <button
      className={`button button__filter ${
        getFilterIndex(id) === -1 ? "" : "selected"
      }`}
      onClick={(e) => handleClick(e, id)}
    >
      {name}
    </button>
  );
}
