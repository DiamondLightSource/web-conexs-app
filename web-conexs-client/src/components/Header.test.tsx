import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "./Header";
import { ThemeProvider } from "@mui/material";
import { DiamondTheme } from "@diamondlightsource/sci-react-ui";
import React from "react";

const themeProvider = ({ children }) => {
  return <ThemeProvider theme={DiamondTheme}>{children}</ThemeProvider>;
};

// const customRender = (ui) => render(ui, );

describe("App", () => {
  it("renders the App component", () => {
    render(<Header />, { wrapper: themeProvider });

    expect(screen.getByText("Web-CONEXS")).toBeDefined();
    // screen.debug(); // prints out the jsx in the App component unto the command line
  });
});
