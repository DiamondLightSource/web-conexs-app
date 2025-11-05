import { Typography } from "@mui/material";
import MainPanel from "../MainPanel";
import QEFormOuter from "./QEFormOuter";

export default function QeSubmitPage() {
  return (
    <MainPanel
      toolbarElements={
        <Typography variant="h5">Submit QE Simulation</Typography>
      }
    >
      <QEFormOuter></QEFormOuter>
    </MainPanel>
  );
}
