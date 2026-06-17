import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeProvider, Typography } from "@mui/material";
import { DiamondTheme } from "@diamondlightsource/sci-react-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RequireAuth from "./RequireAuth";
import { UserContext } from "../UserContext";

const queryClient = new QueryClient();

//@ts-expect-error: Until I figure out the typing for this....
const themeProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={DiamondTheme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

describe("App", () => {
  it("renders the child", () => {
    render(
      <UserContext.Provider
        value={{
          person: { identifier: "test_user", accepted_orca_eula: false },
          person_status: "OK",
        }}
      >
        <RequireAuth requireOrcaEULA={false}>
          <Typography>Passed</Typography>
        </RequireAuth>
        ,
      </UserContext.Provider>,

      { wrapper: themeProvider },
    );

    expect(screen.getByText("Passed")).toBeDefined();
  });

  it("doesnt render the child", () => {
    render(
      <UserContext.Provider
        value={{
          person: { identifier: "test_user", accepted_orca_eula: false },
          person_status: "FORBIDDEN",
        }}
      >
        <RequireAuth requireOrcaEULA={false}>
          <Typography>Passed</Typography>
        </RequireAuth>
        ,
      </UserContext.Provider>,

      { wrapper: themeProvider },
    );

    expect(screen.getByText("not authorised", { exact: false })).toBeDefined();
  });
});
