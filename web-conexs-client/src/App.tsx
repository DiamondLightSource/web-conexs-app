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
import SideDrawer from "./components/SideDrawer";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
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
        </Routes>
      </Stack>
    </ThemeProvider>
  );
}

export default App;
