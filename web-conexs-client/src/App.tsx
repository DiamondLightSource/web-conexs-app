import { CssBaseline, Stack } from "@mui/material";
import Header from "./components/Header";
import WelcomePage from "./components/WelcomePage";
import MoleculePage from "./components/molecules/MoleculePage";
import { Navigate, Route, Routes } from "react-router-dom";
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
import OrcaEulaPage from "./components/orca/OrcaEulaPage";
import RequireAuth from "./components/RequireAuth";
import SideDrawer from "./components/SideDrawer";
import LoginPage from "./components/LoginPage";
import MatProjPage from "./components/crystals/MatProjPage";
import SimulationView from "./components/SimulationView";
import AboutPage from "./components/AboutPage";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={DiamondTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Stack height="100vh" width="100vw" spacing={1}>
            <Header />
            <SideDrawer />
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route
                path="/molecules"
                element={
                  <RequireAuth requireOrcaEULA={false}>
                    <MoleculePage />
                  </RequireAuth>
                }
              />
              <Route
                path="/createmolecule"
                element={
                  <RequireAuth requireOrcaEULA={false}>
                    <CreateMoleculePage />
                  </RequireAuth>
                }
              />
              <Route
                path="/crystals"
                element={
                  <RequireAuth requireOrcaEULA={false}>
                    <CrystalPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/createcrystal"
                element={
                  <RequireAuth requireOrcaEULA={false}>
                    <CreateCystalPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/simulations"
                element={
                  <RequireAuth requireOrcaEULA={false}>
                    <SimulationReviewPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/simulations/:id"
                element={
                  <RequireAuth requireOrcaEULA={false}>
                    <SimulationView />
                  </RequireAuth>
                }
              />
              <Route
                path="/orca"
                element={
                  <RequireAuth requireOrcaEULA={true}>
                    <OrcaSubmitPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/orcaeula"
                element={
                  <RequireAuth requireOrcaEULA={false}>
                    <OrcaEulaPage />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="/fdmnescrystal"
                element={
                  <RequireAuth requireOrcaEULA={false}>
                    <FdmnesSubmitPage key={"crystal"} isCrystal={true} />
                  </RequireAuth>
                }
              />
              <Route
                path="/fdmnesmolecule"
                element={
                  <RequireAuth requireOrcaEULA={false}>
                    <FdmnesSubmitPage key={"molecule"} isCrystal={false} />
                  </RequireAuth>
                }
              />
              <Route
                path="/qe"
                element={
                  <RequireAuth requireOrcaEULA={false}>
                    <QeSubmitPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/login"
                element={
                  <RequireAuth requireOrcaEULA={false}>
                    <LoginPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/matprojcrystal"
                element={
                  <RequireAuth requireOrcaEULA={false}>
                    <MatProjPage />
                  </RequireAuth>
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer
              copyright="Diamond Light Source"
              logo={undefined}
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                height: "4rem",
              }}
            ></Footer>
          </Stack>
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
