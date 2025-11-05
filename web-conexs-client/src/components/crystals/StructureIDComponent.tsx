import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

export default function StructureIDComponent(props: {
  setMpid: (mpid: string) => void;
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
      <Button
        variant="contained"
        onClick={() => {
          if (tmpmMpid != null) {
            props.setMpid(tmpmMpid);
          }
        }}
      >
        Retrieve Structure
      </Button>
    </Stack>
  );
}
