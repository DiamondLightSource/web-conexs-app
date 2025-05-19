import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "./Header";

describe("App", () => {
  it("renders the App component", () => {
    render(<Header colorMode="light" toggleColorMode={()=>{}} />);

    expect(screen.getByText("Web-CONEXS")).toBeDefined();
    // screen.debug(); // prints out the jsx in the App component unto the command line
  });
});
