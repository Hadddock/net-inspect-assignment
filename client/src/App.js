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
    <div className="App">{data ? <PaginatedTable data={data} /> : null}</div>
  );
}

export default App;
