import { Stack, TextField } from "@mui/material";

import { inputToXYZNoHeader } from "../../utils";
import { skipToken, useQuery } from "@tanstack/react-query";
import { getMolecule } from "../../queryfunctions";

export default function XYZFileViewer(props: { id: number | undefined }) {
  const id = props.id;

  const query = useQuery({
    queryKey: ["molecule", props.id],
    queryFn: id ? () => getMolecule(id) : skipToken,
  });

  return (
    <Stack spacing={3} minWidth={"350px"}>
      <TextField
        id="Label"
        label="Label"
        value={query.data == null ? " " : query.data.label}
      />
      <TextField
        sx={{ width: "100%" }}
        id="datafilebox"
        label="Atomic Coordinates (Angstroms)"
        multiline
        rows={12}
        value={query.data != null ? inputToXYZNoHeader(query.data) : ""}
      />
    </Stack>
  );
}
