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
import MoleculePage from "./components/MoleculePage";
import { Route, Routes } from "react-router-dom";
import SimulationReviewPage from "./components/SimulationReviewPage";
import OrcaSubmitPage from "./components/OrcaSubmitPage";
import CrystalPage from "./components/CrystalPage";
import CreateMoleculePage from "./components/CreateMoleculePage";
import FdmnesSubmitPage from "./components/FdmnesSubmitPage";
import CreateCystalPage from "./components/CreateCrystalPage";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(
    prefersDarkMode ? "light" : "dark"
  );

  useMemo(
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
      <Stack height="100vh" width="100vw" spacing={1}>
        <Header />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/molecule" element={<MoleculePage />} />
          <Route path="/createmolecule" element={<CreateMoleculePage />} />
          <Route path="/crystal" element={<CrystalPage />} />
          <Route path="/createcrystal" element={<CreateCystalPage />} />
          <Route path="/simulation" element={<SimulationReviewPage />} />
          <Route path="/orca" element={<OrcaSubmitPage />} />
          <Route path="/fdmnes" element={<FdmnesSubmitPage />} />
        </Routes>
      </Stack>
    </ThemeProvider>
  );
}

export default App;
