import { Stack, Typography } from "@mui/material";
import MainPanel from "../MainPanel";
import { useState } from "react";
import MatProjCrystalViewer from "./MatProjCrystalViewer";
import MatProjGuide from "./MatProjGuide";
import StructureIDComponent from "./StructureIDComponent";

export default function MatProjPage() {
  const [mpid, setMpid] = useState<string | null>(null);

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
          <StructureIDComponent setMpid={setMpid} />
        </Stack>

        {mpid && <MatProjCrystalViewer mpid={mpid}></MatProjCrystalViewer>}
      </Stack>
    </MainPanel>
  );
}
