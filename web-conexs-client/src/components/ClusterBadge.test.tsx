import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@mui/material";
import { DiamondTheme } from "@diamondlightsource/sci-react-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ClusterBadge from "./ClusterBadge";

const queryClient = new QueryClient();

//@ts-expect-error: Until I figure out the typing for this....
const themeProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={DiamondTheme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

vi.mock("../queryfunction", () => {
  return {
    getClusterStatus: () => {
      return { updated: Date.now().toString(), id: 1 };
    },
  };
});

describe("App", () => {
  it("renders the App component", async () => {
    render(<ClusterBadge />, { wrapper: themeProvider });

    await waitFor(() =>
      expect(screen.getByTestId("chiptooltip").ariaLabel).toContain(
        "submitted immediately",
      ),
    );
  });
});
