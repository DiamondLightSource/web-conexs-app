import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "./Header";
import { ThemeProvider } from "@mui/material";
import { DiamondDSTheme } from "@diamondlightsource/sci-react-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserContext } from "../UserContext";

const queryClient = new QueryClient();

//@ts-expect-error: Until I figure out the typing for this....
const themeProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={DiamondDSTheme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

describe("App", () => {
  it("renders the App component", () => {
    render(
      <UserContext.Provider
        value={{
          person: { identifier: "test_user", accepted_orca_eula: false },
          person_status: "OK",
        }}
      >
        <Header />
      </UserContext.Provider>,
      { wrapper: themeProvider },
    );

    expect(screen.getByText("test_user")).toBeDefined();
  });
});
