import {
  Button,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import MainPanel from "../MainPanel";
import { useState } from "react";
import MatProjCrystalViewer from "./MatProjCrystalViewer";

export default function MatProjPage() {
  const [tmpmMpid, setTmpMpid] = useState<string | null>("mp-1234");
  const [mpid, setMpid] = useState<string | null>(null);
  const theme = useTheme();

  return (
    <MainPanel>
      <Stack spacing={"10px"}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.palette.action.disabled,
            borderRadius: "4px 4px 0px 0px",
          }}
        >
          <Typography variant="h5" component="div">
            Materials Project
          </Typography>
        </Toolbar>
        <Stack direction="row" spacing={"5px"} margin="5px">
          <TextField
            id="mpid"
            label="Materials Project ID"
            value={tmpmMpid}
            onChange={(e) => setTmpMpid(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              setMpid(tmpmMpid);
            }}
          >
            Retrieve Structure
          </Button>
        </Stack>
        {mpid && <MatProjCrystalViewer mpid={mpid}></MatProjCrystalViewer>}
      </Stack>
    </MainPanel>
  );
}
