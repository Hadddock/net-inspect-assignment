import "./App.css";
import React, { useEffect, useState } from "react";
import PaginatedTable from "./components/PaginatedTable";

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/v1/qpl/?offset=0&pageSize=100")
        .then((data) => data.json())
        .then((json) => setData(json));
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <h1 style={{ textAlign: "start" }}>View QPL Parts List</h1>
      {data ? (
        <PaginatedTable
          data={data}
          exclude={["qplExpirationDate"]}
          columnHeaderNameMappings={{
            partNumber: "Part Number",
            revision: "Part Revision",
            partName: "Part Name",
            toolDieSetNumber: "Tool / Die Set Number",
            isQualified: "QPL",
            openPo: "Open PO",
            jurisdiction: "Part Jurisdiction",
            classification: "Part Classification",
            supplierName: "Supplier Company Name",
            supplierCode: "Supplier Company Code",
            ctq: "CTQ",
            lastUpdatedBy: "QPL Last Updated By",
            lastUpdatedDate: "QPL Last Updated Date",
          }}
          columnHeaderOrder={[
            "partNumber",
            "revision",
            "partName",
            "toolDieSetNumber",
            "isQualified",
            "openPo",
            "jurisdiction",
            "classification",
            "supplierName",
            "supplierCode",
            "ctq",
            "lastUpdatedBy",
            "lastUpdatedDate",
          ]}
        />
      ) : null}
    </div>
  );
}

export default App;
