import OrcaForm from "./OrcaForm";
import MainPanel from "../MainPanel";
import { Typography } from "@mui/material";

export default function OrcaSubmitPage() {
  return (
    <MainPanel
      toolbarElements={
        <Typography variant="h5">Submit Orca Simulation</Typography>
      }
    >
      <OrcaForm></OrcaForm>
    </MainPanel>
  );
}
