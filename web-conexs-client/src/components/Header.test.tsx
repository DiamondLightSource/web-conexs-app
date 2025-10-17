import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "./Header";
import { ThemeProvider } from "@mui/material";
import { DiamondTheme } from "@diamondlightsource/sci-react-ui";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const themeProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={DiamondTheme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

describe("App", () => {
  it("renders the App component", () => {
    render(<Header />, { wrapper: themeProvider });

    expect(screen.getByText("Web‑CONEXS")).toBeDefined();
  });
});
