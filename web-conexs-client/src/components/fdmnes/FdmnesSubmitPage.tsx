import { Paper, Stack, Typography } from "@mui/material";
import MainPanel from "../MainPanel";

import { useState } from "react";
import StructureViewer from "../StructureViewer";
import FdmnesGuide from "./FdmnesGuide";
import FdmnesForm from "./FdmnesForm";

export default function FdmnesSubmitPage(props: { isCrystal: boolean }) {
  const title =
    "Submit FDMNES " +
    (props.isCrystal ? "Crystal" : "Molecule") +
    " Simulation";

  const [structureId, setStructureId] = useState<undefined | number>(undefined);

  return (
    <MainPanel toolbarElements={<Typography variant="h5">{title}</Typography>}>
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
              <FdmnesForm
                isCrystal={props.isCrystal}
                setStructureId={setStructureId}
              ></FdmnesForm>
            </Stack>
          </Paper>
          <StructureViewer id={structureId} />
        </Stack>

        <FdmnesGuide />
      </Stack>
    </MainPanel>
  );
}
