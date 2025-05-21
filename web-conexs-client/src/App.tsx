import { useState, useMemo } from "react";
import {
  ThemeProvider,
  useMediaQuery,
  CssBaseline,
  Stack,
  createTheme,
} from "@mui/material";
import Header from "./components/Header";
import WelcomePage from "./components/WelcomePage";
import MoleculePage from "./components/molecules/MoleculePage";
import { Route, Routes } from "react-router-dom";
import OrcaSubmitPage from "./components/orca/OrcaSubmitPage";
import CrystalPage from "./components/crystals/CrystalPage";
import CreateMoleculePage from "./components/molecules/CreateMoleculePage";
import FdmnesSubmitPage from "./components/fdmnes/FdmnesSubmitPage";
import CreateCystalPage from "./components/crystals/CreateCrystalPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SimulationReviewPage from "./components/SimulationReviewPage";

const queryClient = new QueryClient();

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Stack height="100vh" width="100vw" spacing={1}>
          <Header
            colorMode={mode}
            toggleColorMode={colorMode.toggleColorMode}
          />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/molecules" element={<MoleculePage />} />
            <Route path="/createmolecule" element={<CreateMoleculePage />} />
            <Route path="/crystals" element={<CrystalPage />} />
            <Route path="/createcrystal" element={<CreateCystalPage />} />
            <Route path="/simulations" element={<SimulationReviewPage />} />
            <Route path="/orca" element={<OrcaSubmitPage />} />
            <Route path="/fdmnes" element={<FdmnesSubmitPage />} />
          </Routes>
        </Stack>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
