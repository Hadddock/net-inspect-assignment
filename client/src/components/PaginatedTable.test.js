import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PaginatedTable from "./PaginatedTable";

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

test("renders learn react link", () => {
  render(<PaginatedTable />);
  const linkElement = screen.getByText(/test/i);
  expect(linkElement).toBeInTheDocument();
});

beforeEach(() => {
  <PaginatedTable data={data} />;
});

describe("Create Paginated Table", () => {});
