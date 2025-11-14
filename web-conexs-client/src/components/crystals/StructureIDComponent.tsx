import { Stack, TextField } from "@mui/material";
import { useState } from "react";
import MatProj from "../icons/MatProj";
import StateIconButton from "../StateIconButton";

export default function StructureIDComponent(props: {
  setMpid: (mpid: string | null) => void;
  disabled: boolean;
  setDisabled: (disabled: boolean) => void;
  state: "ok" | "running" | "error" | "default";
  resetState: () => void;
  currentID: string | null;
}) {
  const [tmpmMpid, setTmpMpid] = useState<string | null>("mp-1234");
  return (
    <Stack direction="column" spacing={"5px"} margin="20px">
      <TextField
        id="mpid"
        label="Materials Project ID"
        value={tmpmMpid}
        onChange={(e) => setTmpMpid(e.target.value)}
      />
      <StateIconButton
        endIcon={<MatProj />}
        resetState={props.resetState}
        state={props.state}
        disabled={props.disabled}
        variant="contained"
        onClick={() => {
          if (tmpmMpid != null) {
            if (tmpmMpid != props.currentID) {
              props.setDisabled(true);
              props.setMpid(tmpmMpid);
            }
          }
        }}
      >
        Retrieve Structure
      </StateIconButton>
    </Stack>
  );
}
