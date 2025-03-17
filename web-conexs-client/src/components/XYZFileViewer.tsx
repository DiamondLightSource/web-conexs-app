import { Stack, TextField } from "@mui/material";

import { MoleculeInput } from "../models";

export default function XYZFileViewer(props: {
  molecule: MoleculeInput | null;
}) {
  return (
    <Stack spacing={3} minWidth={"450px"}>
      <TextField
        id="Label"
        label="Label"
        value={props.molecule == null ? " " : props.molecule.label}
      />
      <TextField
        sx={{ width: "100%" }}
        id="datafilebox"
        label="Atomic Coordinates (Angstroms)"
        multiline
        rows={12}
        value={props.molecule != null ? props.molecule.structure : ""}
      />
    </Stack>
  );
}
