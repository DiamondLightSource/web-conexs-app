import { Stack, Typography } from "@mui/material";
import MainPanel from "../MainPanel";
import { useState } from "react";
import MatProjCrystalViewer from "./MatProjCrystalViewer";
import MatProjGuide from "./MatProjGuide";
import StructureIDComponent from "./StructureIDComponent";
import useStateIconButton from "../useStateIconButton";

export default function MatProjPage() {
  const [mpid, setMpid] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const { state, setState, resetState } = useStateIconButton();

  return (
    <MainPanel
      toolbarElements={
        <Typography variant="h5">
          Crystal Structure from Materials Project
        </Typography>
      }
    >
      <Stack overflow="auto">
        <Stack
          direction={{ sm: "column", md: "row" }}
          sx={{ alignItems: "center" }}
        >
          <MatProjGuide />
          <StructureIDComponent
            setMpid={setMpid}
            disabled={disabled}
            setDisabled={setDisabled}
            state={state}
            resetState={resetState}
            currentID={mpid}
          />
        </Stack>

        {mpid && (
          <MatProjCrystalViewer
            mpid={mpid}
            setRequestComplete={() => setDisabled(false)}
            setRequestStatus={setState}
          ></MatProjCrystalViewer>
        )}
      </Stack>
    </MainPanel>
  );
}
