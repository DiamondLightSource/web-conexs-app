import { Paper, Stack, Typography } from "@mui/material";
import MainPanel from "../MainPanel";
import QEForm from "./QEForm";
import StructureViewer from "../StructureViewer";
import QEGuide from "./QEGuide";
import { useState } from "react";

export default function QeSubmitPage() {
  const [structureId, setStructureId] = useState<undefined | number>(undefined);
  const [selectedAtom, setSelectedAtom] = useState<number>(0);

  return (
    <MainPanel
      toolbarElements={
        <Typography variant="h5">Submit QE Simulation</Typography>
      }
    >
      <Stack
        direction={{ sm: "column", md: "row" }}
        flex={1}
        spacing={"5px"}
        alignContent={"stretch"}
        margin={"10px"}
        overflow={"auto"}
      >
        <Stack flex={1} margin={"10px"} spacing="10px">
          <Paper margin={"10px"} spacing="10px" elevation={16} flex={1}>
            <Stack flex={1} margin={"10px"} spacing="10px">
              <QEForm
                setStructureId={setStructureId}
                setSelectedAtom={setSelectedAtom}
              ></QEForm>
            </Stack>
          </Paper>
          <StructureViewer id={structureId} labelledAtomIndex={selectedAtom} />
        </Stack>

        <QEGuide />
      </Stack>
    </MainPanel>
  );
}
