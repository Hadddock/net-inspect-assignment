import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PaginatedTable from "./PaginatedTable";

test("renders learn react link", () => {
  render(<PaginatedTable />);
  const linkElement = screen.getByText(/test/i);
  expect(linkElement).toBeInTheDocument();
});
