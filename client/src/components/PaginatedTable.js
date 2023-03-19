import React, { useState, useEffect } from "react";

const PaginatedTable = ({
  data,
  exclude = [],
  columnHeaderNameMappings = {},
  columnHeaderOrder = [],
  initialPageSize = 20,
}) => {
  const getColumnHeaders = () => {
    let columnHeaderSet = new Set();
    data
      .map((entry) => Object.keys(entry))
      .forEach((keyArray) =>
        keyArray.forEach((key) => columnHeaderSet.add(key))
      );

    let filteredHeaders = [...columnHeaderSet].filter(
      (header) => !exclude.includes(header)
    );

    columnHeaderSet = new Set();

    if (columnHeaderOrder.length) {
      columnHeaderOrder.forEach((header) => {
        if (filteredHeaders.includes(header)) {
          columnHeaderSet.add(header);
        }
      });
    }
    filteredHeaders.forEach((header) => columnHeaderSet.add(header));

    return [...columnHeaderSet];
  };

  const goToNextPage = () => {
    if (pageSize * pageNumber < displayedData.length) {
      setPageNumber((pageNumber) => pageNumber + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pageNumber !== 1) {
      setPageNumber((pageNumber) => pageNumber - 1);
    }
  };

  const goToLastPage = () => {
    let lastPageNumber = Math.max(
      Math.floor(displayedData.length / pageSize),
      1
    );
    if (pageNumber !== lastPageNumber) {
      setPageNumber(lastPageNumber);
    }
  };

  const goToFirstPage = () => {
    if (pageNumber !== 1) {
      setPageNumber(1);
    }
  };

  const adjustPageSize = (e) => {
    setPageNumber(1);
    setPageSize(e.target.value);
  };

  const searchItems = (e) => {
    e.preventDefault();
    let searchQuery = document.getElementById("search").value;
    if (searchQuery && searchQuery.trim()) {
      setDisplayedData(
        data.filter((item) =>
          Object.values(item)
            .map((item) => convertValueToDisplayString(item).toLowerCase())
            .includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setDisplayedData(data);
    }
    goToFirstPage();
  };

  const convertValueToDisplayString = (value) => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (Date.parse(value)) {
      return new Date(value).toLocaleString().split(",")[0];
    }

    return value.toString();
  };

  const [displayedData, setDisplayedData] = useState([]);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setDisplayedData(data);
  }, [data, displayedData]);

  const columnHeaders = getColumnHeaders();

  return (
    <div className="PaginatedTable">
      <form type="submit" onSubmit={searchItems}>
        <input
          id="search"
          type="text"
          placeholder="Search..."
          name="search"
        ></input>
        <input type="submit" alt="search button" />
      </form>

      <table role="table">
        <thead role="rowgroup">
          <tr role="row">
            {columnHeaders.map((headerName) => (
              <th role="columnheader" key={headerName}>
                {columnHeaderNameMappings[headerName] !== undefined
                  ? columnHeaderNameMappings[headerName]
                  : headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {displayedData
            .slice((pageNumber - 1) * pageSize, pageSize * pageNumber)
            .map((entry) => (
              <tr role="row">
                {columnHeaders.map((header) => (
                  <td role="cell">
                    {convertValueToDisplayString(entry[header])}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        <button onClick={goToFirstPage}>first</button>
        <button onClick={goToPreviousPage}>previous</button>
        <div data-testid="page-number">{pageNumber}</div>
        <button onClick={goToNextPage}>next</button>
        <button onClick={goToLastPage}>last</button>
        <select
          defaultValue={pageSize}
          data-testid="page-size"
          onChange={adjustPageSize}
        >
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <div data-testid="showing-items">
          Showing items{" "}
          {`${pageSize * (pageNumber - 1) + 1} - ${Math.min(
            displayedData.length,
            pageSize * pageNumber
          )}`}
        </div>
      </div>
    </div>
  );
};

export default PaginatedTable;
