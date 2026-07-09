import MainPanel from "../MainPanel";
import { Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import StructureViewer from "../StructureViewer";
import OrcaGuide from "./OrcaGuide";
import OrcaForm from "./OrcaForm";
import MoleculeIcon from "../icons/MoleculeIcon";

export default function OrcaSubmitPage() {
  const [structureId, setStructureId] = useState<undefined | number>(undefined);

  return (
    <MainPanel
      toolbarElements={
        <Stack direction="row" spacing="5px" alignItems="center">
          <MoleculeIcon />
          <Typography variant="h5">Submit Orca Simulation</Typography>
        </Stack>
      }
    >
      <Stack
        direction={{ sm: "column", md: "row" }}
        flex={1}
        spacing={"5px"}
        align-content={"stretch"}
        margin={"10px"}
        overflow={"auto"}
      >
        <Stack flex={1} margin={"10px"} spacing="10px">
          <Paper margin={"10px"} spacing="10px" elevation={16}>
            <Stack flex={1} margin={"10px"} spacing="10px">
              <OrcaForm setStructureId={setStructureId}></OrcaForm>
            </Stack>
          </Paper>
          <StructureViewer id={structureId} />
        </Stack>
        <OrcaGuide />
      </Stack>
    </MainPanel>
  );
}
