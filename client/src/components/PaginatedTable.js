import React, { useState, useEffect } from "react";

const PaginatedTable = ({
  data,
  exclude = [],
  columnHeaderNameMappings = {},
}) => {
  const getColumnHeaders = () => {
    const columnHeaderSet = new Set();
    data
      .map((entry) => Object.keys(entry))
      .forEach((keyArray) =>
        keyArray.forEach((key) => columnHeaderSet.add(key))
      );

    return [...columnHeaderSet].filter((header) => !exclude.includes(header));
  };

  const [displayedData, setDisplayedData] = useState(data);

  const columnHeaders = getColumnHeaders();

  return (
    <div className="PaginatedTable">
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
          {displayedData.map((entry) => (
            <tr role="row">
              {Object.values(entry).map((value) => (
                <td role="cell">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaginatedTable;
