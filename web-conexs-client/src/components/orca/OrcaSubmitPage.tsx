import {
  Box,
  Paper,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import OrcaForm from "./OrcaForm";
import MainPanel from "../MainPanel";

export default function OrcaSubmitPage() {
  const theme = useTheme();
  return (
    <MainPanel>
      <Stack flex={1} overflow="auto">
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.palette.action.disabled,
            borderRadius: "4px 4px 0px 0px",
          }}
        >
          <Typography variant="h5" component="div">
            Submit Orca Simulation
          </Typography>
        </Toolbar>
        <OrcaForm></OrcaForm>
      </Stack>
    </MainPanel>
  );
}
