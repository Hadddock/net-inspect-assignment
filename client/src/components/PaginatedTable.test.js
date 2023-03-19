import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import PaginatedTable from "./PaginatedTable";
import userEvent from "@testing-library/user-event";

const data = [
  {
    classification: "Baby",
    ctq: false,
    isQualified: true,
    jurisdiction: "Research and Development",
    lastUpdatedBy: "tmccahey0",
    lastUpdatedDate: "2017-11-24T03:43:02Z",
    openPo: false,
    partName: "Kanlam",
    partNumber: "YOKWIA",
    qplExpirationDate: "2019-04-08T14:14:17Z",
    revision: "HRHD",
    supplierCode: "36987-1760",
    supplierName: "Aimbo",
    toolDieSetNumber: "OSJJO4",
  },
  {
    classification: "Garden",
    ctq: false,
    isQualified: true,
    jurisdiction: "Training",
    lastUpdatedBy: "sbarhams1",
    lastUpdatedDate: "2018-08-06T14:26:51Z",
    openPo: false,
    partName: "Gembucket",
    partNumber: "06WDD0",
    qplExpirationDate: "2018-04-18T14:47:05Z",
    revision: "V20W",
    supplierCode: "64725-0221",
    supplierName: "Kwimbee",
    toolDieSetNumber: "RCS6FK",
  },
  {
    classification: "Movies",
    ctq: false,
    isQualified: true,
    jurisdiction: "Human Resources",
    lastUpdatedBy: "neason2",
    lastUpdatedDate: "2017-12-06T23:53:23Z",
    openPo: true,
    partName: "Toughjoyfax",
    partNumber: "B8IS2O",
    qplExpirationDate: "2019-10-31T20:08:00Z",
    revision: "60P4",
    supplierCode: "43857-0140",
    supplierName: "Tambee",
    toolDieSetNumber: "LL0N2K",
  },
  {
    classification: "Baby",
    ctq: true,
    isQualified: false,
    jurisdiction: "Training",
    lastUpdatedBy: "broddy3",
    lastUpdatedDate: "2019-03-04T01:41:47Z",
    openPo: false,
    partName: "Tres-Zap",
    partNumber: "Y4TFLI",
    qplExpirationDate: "2019-07-27T14:53:24Z",
    revision: "JS86",
    supplierCode: "17772-122",
    supplierName: "Realcube",
    toolDieSetNumber: "KRE2TR",
  },
];

test("display column header", () => {
  render(<PaginatedTable data={data} />);
  const columnHeaders = screen.getAllByRole("columnheader");
  expect(columnHeaders[0].textContent).toMatch("classification");
});

test("display column headers in order", () => {
  render(<PaginatedTable data={data} />);
  const columnHeaders = screen.getAllByRole("columnheader");
  expect(columnHeaders[0].textContent).toMatch("classification");
  expect(columnHeaders[1].textContent).toMatch("ctq");
  expect(columnHeaders[13].textContent).toMatch("toolDieSetNumber");
});

test("exclude selected column headers", () => {
  render(<PaginatedTable data={data} exclude={["lastUpdatedBy"]} />);
  const columnHeaders = screen.getAllByRole("columnheader");
  expect(columnHeaders.map((header) => header.textContent)).not.toContain(
    "lastUpdatedBy"
  );
});

test("reorder column headers", () => {
  render(
    <PaginatedTable
      data={data}
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
  );
  const cells = screen.getAllByRole("columnheader");
  expect(cells.map((header) => header.textContent)[0]).toBe("partNumber");
});

test("reorder column headers with partial list", () => {
  render(<PaginatedTable data={data} columnHeaderOrder={["partNumber"]} />);
  const cells = screen.getAllByRole("columnheader");
  expect(cells.map((header) => header.textContent)[0]).toBe("partNumber");
  expect(cells.map((header) => header.textContent)[1]).toBe("classification");
});

test("remap column header name", () => {
  render(
    <PaginatedTable
      data={data}
      exclude={["lastUpdatedBy"]}
      columnHeaderNameMappings={{ partNumber: "Part Number" }}
    />
  );
  const columnHeaders = screen.getAllByRole("columnheader");
  expect(columnHeaders.map((header) => header.textContent)).toContain(
    "Part Number"
  );
});

test("display cell entry", () => {
  render(<PaginatedTable data={data} />);
  const cells = screen.getAllByRole("cell");
  expect(cells.map((cell) => cell.textContent)[0]).toBe("Baby");
});

test("display cell entry in column header order", () => {
  render(<PaginatedTable data={data} columnHeaderOrder={["partNumber"]} />);
  const cells = screen.getAllByRole("cell");
  expect(cells.map((cell) => cell.textContent)[0]).toBe("YOKWIA");
});

test("display number of items specified by initialPageSize", () => {
  render(<PaginatedTable data={data} initialPageSize={2} />);
  const rows = screen.getAllByRole("row");
  //number of data rows set by page size (2) + column header row (1)
  expect(rows.length).toBe(3);
});

test("go to next page", async () => {
  render(<PaginatedTable data={data} initialPageSize={1} />);
  const button = screen.getByRole("button", { name: "next" });
  const pageNumber = screen.getByTestId("page-number");
  act(() => userEvent.click(button));
  expect(pageNumber.textContent).toBe("2");
  act(() => userEvent.click(button));
  expect(pageNumber.textContent).toBe("3");
  act(() => userEvent.click(button));
  expect(pageNumber.textContent).toBe("4");
  act(() => userEvent.click(button));
  //end of accessible pages, remain at 4
  expect(pageNumber.textContent).toBe("4");
});

test("go to previous page", async () => {
  render(<PaginatedTable data={data} initialPageSize={1} />);
  const nextButton = screen.getByRole("button", { name: "next" });
  const previousButton = screen.getByRole("button", { name: "previous" });

  const pageNumber = screen.getByTestId("page-number");
  //cannot go before first page, remain at 1
  act(() => userEvent.click(previousButton));
  expect(pageNumber.textContent).toBe("1");
  act(() => userEvent.click(nextButton));
  act(() => userEvent.click(previousButton));
  expect(pageNumber.textContent).toBe("1");
});

test("go to first page", async () => {
  render(<PaginatedTable data={data} initialPageSize={1} />);
  const nextButton = screen.getByRole("button", { name: "next" });
  const firstButton = screen.getByRole("button", { name: "first" });
  const pageNumber = screen.getByTestId("page-number");
  act(() => userEvent.click(firstButton));
  //already at first page, nothing happens
  expect(pageNumber.textContent).toBe("1");
  act(() => userEvent.click(nextButton));
  act(() => userEvent.click(nextButton));
  act(() => userEvent.click(firstButton));
  expect(pageNumber.textContent).toBe("1");
});

test("go to last page", async () => {
  render(<PaginatedTable data={data} initialPageSize={1} />);

  const lastButton = screen.getByRole("button", { name: "last" });
  const pageNumber = screen.getByTestId("page-number");
  act(() => userEvent.click(lastButton));
  expect(pageNumber.textContent).toBe("4");
  act(() => userEvent.click(lastButton));
  //already at last page, nothing happens
  expect(pageNumber.textContent).toBe("4");
});

test("adjust page size", async () => {
  render(<PaginatedTable data={data} />);
  //initial page size is 20
  expect(screen.getByRole("option", { name: "20" }).selected).toBe(true);
  const pageSize = screen.getByRole("combobox");
  //select page size of 1
  act(() => userEvent.selectOptions(pageSize, ["1"]));
  expect(screen.getByRole("option", { name: "1" }).selected).toBe(true);

  //assert correct number of rows
  const rows = screen.getAllByRole("row");
  expect(rows.length).toBe(2);
});

test("showing items", async () => {
  render(<PaginatedTable data={data} />);
  const showingItems = screen.getByTestId("showing-items");
  expect(showingItems.textContent).toBe("Showing items 1 - 4");
});

test("showing items adjust page size", async () => {
  render(<PaginatedTable data={data} initialPageSize={2} />);
  const showingItems = screen.getByTestId("showing-items");
  expect(showingItems.textContent).toBe("Showing items 1 - 2");

  const pageSize = screen.getByRole("combobox");
  act(() => userEvent.selectOptions(pageSize, ["1"]));
  expect(showingItems.textContent).toBe("Showing items 1 - 1");
});

test("showing items change page", async () => {
  render(<PaginatedTable data={data} initialPageSize={2} />);
  const showingItems = screen.getByTestId("showing-items");
  expect(showingItems.textContent).toBe("Showing items 1 - 2");
  const button = screen.getByRole("button", { name: "next" });
  act(() => userEvent.click(button));
  expect(showingItems.textContent).toBe("Showing items 3 - 4");
});
