import React, { useState, useEffect } from "react";
import "./PaginatedTable.scss";
import { v4 as uuid } from "uuid";
import LastSvg from "./../assets/images/last.svg";
import NextSvg from "./../assets/images/next.svg";
import PreviousSvg from "./../assets/images/previous.svg";
import FirstSvg from "./../assets/images/first.svg";
import SearchSvg from "./../assets/images/search.svg";
import { PropTypes } from "prop-types";

/**
 * Component for displaying a Paginated Table.
 *
 * @component
 * @param {Array} data - array of JavaScript objects containing only key value pairs to be displayed in a paginated table
 * @param {Array} excludedColumnHeaders - array of strings representing column headers to be excluded from the table
 * @param {{}} columnHeaderNameMappings - object with keys of column headers and values of the string to be displayed in their place
 * @param {[]} columnHeaderOrder - array of strings arranged in order determining the order of displayed column headers. Any columns taken from keys in `data` but not listed in `columnHeaderOrder` are placed after headers in `columnHeaderOrder`
 * @param {number} initialPageSize - number representing the initial max size of each page displayed
 */
const PaginatedTable = ({
  data,
  excludedColumnHeaders = [],
  columnHeaderNameMappings = {},
  columnHeaderOrder = [],
  initialPageSize = 20,
}) => {
  const [displayedData, setDisplayedData] = useState([]);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setDisplayedData(data);
  }, [data]);

  const getColumnHeaders = () => {
    const keySet = new Set();
    // add all key values from all objects in to set
    data
      .map((entry) => Object.keys(entry))
      .forEach((keyArray) => keyArray.forEach((key) => keySet.add(key)));

    /* if a header exists in both columnHeaderOreder and keySet, add it to orderedHeaderSet.
    this is to transfer columnHeaderOrder's order into orderedHeaderSet while
    discarding headers with no matching data */
    const orderedHeaderSet = new Set();
    if (columnHeaderOrder.length) {
      columnHeaderOrder.forEach((header) => {
        if (keySet.has(header)) {
          orderedHeaderSet.add(header);
        }
      });
    }
    //add headers not listed in orderedHeaderSet
    keySet.forEach((header) => orderedHeaderSet.add(header));
    // discard all headers listed in excludedColumnHeaders
    return [...orderedHeaderSet].filter(
      (header) => !excludedColumnHeaders.includes(header)
    );
  };

  const columnHeaders = getColumnHeaders();

  const getLastPage = () => {
    return Math.max(Math.floor(displayedData.length / pageSize), 1);
  };

  const goToNextPage = () => {
    const lastPage = getLastPage();
    if (
      pageSize * pageNumber < displayedData.length &&
      pageNumber !== lastPage
    ) {
      setPageNumber((pageNumber) => Math.min(pageNumber + 1, lastPage));
    }
  };

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((pageNumber) => pageNumber - 1);
    }
  };

  const goToLastPage = () => {
    const lastPage = getLastPage();
    if (pageNumber !== lastPage) {
      setPageNumber(lastPage);
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

    let searchQuery = document.getElementById("search").value.toLowerCase();

    if (searchQuery && searchQuery.trim()) {
      setDisplayedData(
        data.filter((object) =>
          objectHasKeyContainingPartialString(object, searchQuery)
        )
      );
    } else {
      setDisplayedData(data);
    }
    goToFirstPage();
  };

  const objectHasKeyContainingPartialString = (object, partialString) => {
    let values = Object.values(object);
    let currentKey = "";
    for (let i = 0; i < values.length; i++) {
      currentKey = convertValueToDisplayString(values[i]).toLowerCase();
      if (currentKey.includes(partialString)) {
        return true;
      }
    }
    return false;
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

  return (
    <div className="PaginatedTable">
      <form
        className="PaginatedTable__search-form"
        type="submit"
        onSubmit={searchItems}
      >
        <input
          className="PaginatedTable__search-bar"
          id="search"
          onChange={searchItems}
          type="search"
          placeholder="Search..."
          name="search"
        ></input>
        <input
          className="PaginatedTable__search-button"
          type="image"
          src={SearchSvg}
          aria-label="enter search"
          width="35px"
          height="35px"
          onClick={searchItems}
        />
      </form>

      <div className="PaginatedTable__table-container">
        <table className="PaginatedTable__table" role="table">
          <thead>
            <tr role="row" className="PaginatedTable__column-header-row">
              {columnHeaders.map((headerName) => (
                <th
                  className="PaginatedTable__column-header"
                  role="columnheader"
                  key={headerName}
                >
                  {columnHeaderNameMappings[headerName] !== undefined
                    ? columnHeaderNameMappings[headerName]
                    : headerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedData
              .slice((pageNumber - 1) * pageSize, pageSize * pageNumber)
              .map((entry) => (
                <tr key={uuid()} className="PaginatedTable__row" role="row">
                  {columnHeaders.map((header) => (
                    <td
                      key={uuid()}
                      className="PaginatedTable__cell"
                      role="cell"
                    >
                      {convertValueToDisplayString(entry[header])}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="PaginatedTable__page-container">
        <div className="PaginatedTable__page-selection">
          <button
            className="PaginatedTable__page-button"
            onClick={goToFirstPage}
            aria-label="first page"
          >
            <img
              src={FirstSvg}
              alt="first page icon"
              width="24px"
              height="24px"
            />
          </button>
          <button
            className="PaginatedTable__page-button"
            onClick={goToPreviousPage}
            aria-label="previous page"
          >
            <img
              src={PreviousSvg}
              alt="previous page icon"
              width="24px"
              height="24px"
            />
          </button>
          <span className="PaginatedTable__page-number-container">
            <span
              className="PaginatedTable__page-number"
              data-testid="page-number"
            >
              {pageNumber}
            </span>
          </span>

          <button
            className="PaginatedTable__page-button"
            onClick={goToNextPage}
            aria-label="next page"
          >
            <img
              src={NextSvg}
              alt="next page icon"
              width="24px"
              height="24px"
            />
          </button>
          <button
            className="PaginatedTable__page-button"
            onClick={goToLastPage}
            aria-label="last page"
          >
            <img
              src={LastSvg}
              alt="last page icon"
              width="24px"
              height="24px"
            />
          </button>
          <select
            className="PaginatedTable__page-select"
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
          <span className="PaginatedTable__items-per-page-display">
            items per page
          </span>
        </div>
        <div data-testid="showing-items">
          {displayedData.length === 0
            ? "No items found"
            : `Showing items ${pageSize * (pageNumber - 1) + 1} - ${Math.min(
                displayedData.length,
                pageSize * pageNumber
              )}`}
        </div>
      </div>
    </div>
  );
};

PaginatedTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  excludedColumnHeaders: PropTypes.arrayOf(PropTypes.string),
  columnHeaderNameMappings: PropTypes.arrayOf(PropTypes.object),
  columnHeaderOrder: PropTypes.arrayOf(PropTypes.string),
  initialPageSize: PropTypes.number,
};

export default PaginatedTable;
