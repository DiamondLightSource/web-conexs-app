import { CssBaseline, Stack } from "@mui/material";
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
import { UserProvider } from "./UserContext";

import {
  ThemeProvider,
  DiamondTheme,
  Footer,
} from "@diamondlightsource/sci-react-ui";
import QeSubmitPage from "./components/qe/QESubmitPage";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={DiamondTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Stack height="100vh" width="100vw" spacing={1}>
            <Header />
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/molecules" element={<MoleculePage />} />
              <Route path="/createmolecule" element={<CreateMoleculePage />} />
              <Route path="/crystals" element={<CrystalPage />} />
              <Route path="/createcrystal" element={<CreateCystalPage />} />
              <Route path="/simulations" element={<SimulationReviewPage />} />
              <Route path="/orca" element={<OrcaSubmitPage />} />
              <Route
                path="/fdmnescrystal"
                element={<FdmnesSubmitPage key={"crystal"} isCrystal={true} />}
              />
              <Route
                path="/fdmnesmolecule"
                element={
                  <FdmnesSubmitPage key={"molecule"} isCrystal={false} />
                }
              />
              <Route path="/qe" element={<QeSubmitPage />} />
            </Routes>
            <Footer copyright="Diamond Light Source" logo={null} />
          </Stack>
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
