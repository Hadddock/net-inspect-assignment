import React, { useState, useEffect } from "react";

const PaginatedTable = ({ data }) => {
  let columnHeaderSet = new Set();

  data
    .map((entry) => Object.keys(entry))
    .forEach((keyArray) => keyArray.forEach((key) => columnHeaderSet.add(key)));

  const columnHeaders = [...columnHeaderSet];

  return (
    <div className="PaginatedTable">
      <table role="table">
        <thead role="rowgroup">
          <tr role="row">
            {columnHeaders.map((headerName) => (
              <th role="columnheader" key={headerName}>
                {headerName}
              </th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default PaginatedTable;
